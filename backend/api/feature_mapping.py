# api/feature_mapping.py
import numpy as np

def build_model_features_from_friendly(data, feature_means, feature_order):
    """
    Convert human-friendly fields (amount, channel, etc.) into
    synthetic model features [Time, V1..V28, Amount].

    NOTE: this is NOT real PCA; it is only for demo to simulate
    internal features. For a real system you should save & use the
    actual preprocessing pipeline used during training.
    """

    # ----- 1. Extract / encode human inputs -----
    # Amount & pseudo-Time (you can change logic as you like)
    amount = float(data.get('amount', feature_means.get('Amount', 0.0)))
    # 'time_since_last_txn' as a proxy for Time; fallback to mean
    time_raw = float(data.get('time_since_last_txn', feature_means.get('Time', 0.0)))

    channel_map = {'online': 0, 'pos': 1, 'atm': 2}
    merchant_map = {
        'electronics': 0, 'groceries': 1, 'clothing': 2, 'travel': 3,
        'gaming': 4, 'utilities': 5, 'restaurants': 6, 'fuel': 7,
    }
    country_map = {'IN': 0, 'US': 1, 'UK': 2, 'CA': 3, 'AU': 4, 'SG': 5}
    tod_map = {'morning': 0, 'afternoon': 1, 'evening': 2, 'night': 3}
    dow_map = {'mon': 0, 'tue': 1, 'wed': 2, 'thu': 3, 'fri': 4, 'sat': 5, 'sun': 6}

    channel = channel_map.get(data.get('channel', 'online').lower(), 0)
    merchant = merchant_map.get(data.get('merchant_category', 'electronics').lower(), 0)
    country = country_map.get(data.get('country', 'IN'), 0)
    tod = tod_map.get(data.get('time_of_day', 'morning').lower(), 0)
    dow = dow_map.get(data.get('day_of_week', 'mon').lower(), 0)

    prev_24h = float(data.get('previous_24h_txns', 0))
    avg_7d = float(data.get('avg_amount_7d', amount))
    chargeback = 1.0 if str(data.get('chargeback_history', 'no')).lower() == 'yes' else 0.0

    # Make a small "raw feature" vector (10 dimensions)
    raw_vec = np.array([
        amount,
        time_raw,
        channel,
        merchant,
        country,
        tod,
        dow,
        prev_24h,
        avg_7d,
        chargeback,
    ], dtype=float)

    # Simple normalization to keep values in reasonable ranges
    # (just to make synthetic V's look nicer)
    norm_vec = raw_vec / np.array([
        1000.0,  # amount scale
        60.0,    # time scale
        2.0,     # channel
        7.0,     # merchant
        5.0,     # country
        3.0,     # time_of_day
        6.0,     # day_of_week
        10.0,    # previous_24h_txns
        1000.0,  # avg_amount_7d
        1.0,     # chargeback
    ])

    # ----- 2. Build synthetic V1..V28 from norm_vec -----
    V_values = []

    # create 28 synthetic features by mixing the 10 base values
    for i in range(28):
        # rotate indices so each V uses a different combination
        idx1 = i % len(norm_vec)
        idx2 = (i + 3) % len(norm_vec)
        idx3 = (i + 6) % len(norm_vec)

        v_i = (
            0.7 * norm_vec[idx1] +
            0.4 * norm_vec[idx2] -
            0.3 * norm_vec[idx3] +
            0.01 * (i + 1)
        )
        V_values.append(float(v_i))

    # ----- 3. Assemble final feature vector in the original order -----
    features = []
    for feat in feature_order:
        if feat == 'Time':
            features.append(time_raw)
        elif feat == 'Amount':
            features.append(amount)
        elif feat.startswith('V'):
            # index from V1..V28
            idx = int(feat[1:]) - 1
            features.append(V_values[idx])
        else:
            # fallback if something unexpected
            features.append(feature_means.get(feat, 0.0))

    return features

import { Card } from "@/components/ui/card";
import { Shield, Brain, Database, Zap, Lock, TrendingUp } from "lucide-react";

const About = () => {
  const technologies = [
    { name: "React", description: "Modern UI framework for building interactive interfaces" },
    { name: "Django REST Framework", description: "Powerful backend API framework" },
    { name: "RandomForest Classifier", description: "Ensemble learning algorithm for classification" },
    { name: "SMOTE", description: "Synthetic Minority Over-sampling Technique for balanced datasets" },
    { name: "StandardScaler", description: "Feature standardization for optimal model performance" },
    { name: "Scikit-learn", description: "Machine learning library for Python" },
  ];

  const features = [
    {
      icon: Brain,
      title: "Machine Learning Powered",
      description: "Advanced RandomForest algorithm trained on real transaction patterns to identify fraud with high accuracy"
    },
    {
      icon: Zap,
      title: "Real-time Detection",
      description: "Get instant fraud predictions within milliseconds of submitting transaction details"
    },
    {
      icon: Database,
      title: "Comprehensive Analysis",
      description: "Analyzes transaction amount, timing, and patterns to detect anomalies"
    },
    {
      icon: Lock,
      title: "Secure Processing",
      description: "All data is processed securely with industry-standard encryption and privacy measures"
    },
    {
      icon: TrendingUp,
      title: "High Accuracy",
      description: "99.5% detection accuracy achieved through SMOTE balancing and feature scaling"
    },
    {
      icon: Shield,
      title: "Fraud Prevention",
      description: "Helps protect against financial losses by identifying suspicious transactions early"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-20 w-20 mx-auto mb-6 opacity-90" />
          <h1 className="text-5xl font-bold mb-4">About FraudGuard</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            An intelligent credit card fraud detection system powered by advanced machine learning
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Purpose Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Purpose</h2>
          <Card className="p-8">
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              Credit card fraud is a growing concern in today's digital economy, costing businesses 
              and consumers billions of dollars annually. FraudGuard was created to help combat this 
              threat by providing an accessible, accurate, and fast fraud detection system.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our system leverages cutting-edge machine learning techniques to analyze transaction 
              patterns and identify potentially fraudulent activities in real-time, enabling businesses 
              to take immediate action and protect their customers.
            </p>
          </Card>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">How Fraud Detection Works</h2>
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                  Data Collection
                </h3>
                <p className="text-muted-foreground ml-10">
                  Transaction details (amount, time) are collected from the user input form.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                  Preprocessing
                </h3>
                <p className="text-muted-foreground ml-10">
                  Features are standardized using StandardScaler to ensure optimal model performance. 
                  Our training dataset was balanced using SMOTE to handle class imbalance.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
                  Model Prediction
                </h3>
                <p className="text-muted-foreground ml-10">
                  The RandomForest Classifier analyzes the transaction using patterns learned from 
                  thousands of historical transactions to determine fraud probability.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">4</span>
                  Result Delivery
                </h3>
                <p className="text-muted-foreground ml-10">
                  The system returns a clear prediction (Fraudulent/Safe) along with confidence 
                  scores and recommended actions.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Technologies */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Technologies Used</h2>
          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {technologies.map((tech, index) => (
                <div key={index} className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-lg mb-1">{tech.name}</h3>
                  <p className="text-muted-foreground">{tech.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Disclaimer */}
        <section>
          <Card className="p-8 bg-muted/50 border-2 border-border">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Important Disclaimer
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              This fraud detection tool is designed for <strong>educational and demonstration purposes</strong>. 
              While our machine learning model is trained on realistic patterns and achieves high accuracy, 
              it should not be used as the sole basis for financial decisions or fraud investigations. 
              Always consult with financial security professionals and implement multiple layers of 
              verification before taking action on potentially fraudulent transactions. This tool is 
              not a financial advisory service and should be used in conjunction with other security 
              measures and manual review processes.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;

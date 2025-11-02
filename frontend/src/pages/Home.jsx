import { Link } from "react-router-dom";
import { Shield, TrendingUp, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: "Advanced Detection",
      description: "Machine learning powered fraud detection using RandomForest algorithms"
    },
    {
      icon: TrendingUp,
      title: "Real-time Analysis",
      description: "Instant transaction verification with high accuracy predictions"
    },
    {
      icon: Lock,
      title: "Secure Processing",
      description: "Your transaction data is processed securely and confidentially"
    },
    {
      icon: Zap,
      title: "Fast Results",
      description: "Get fraud predictions in milliseconds with detailed insights"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary py-20">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center text-primary-foreground">
            <h1 className="mb-6 text-5xl font-bold leading-tight">
              Credit Card Fraud Detection System
            </h1>
            <p className="mb-8 text-xl opacity-90">
              An intelligent system that helps detect potentially fraudulent credit card transactions 
              using a trained machine learning model. Enter a transaction and get real-time fraud prediction!
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/request">
                <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-shadow">
                  Check Transaction
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FraudGuard?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.5%</div>
              <div className="text-muted-foreground">Detection Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">&lt;100ms</div>
              <div className="text-muted-foreground">Response Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <div className="text-muted-foreground">Protection</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

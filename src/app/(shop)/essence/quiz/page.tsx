"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getQuizRecommendations } from "@/features/shop/actions/quiz-actions";
import { ProductCard } from "@/features/shop/components/product-card";
import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { ProductListItem } from "@/features/shop/actions";

type QuizStep = {
  id: "mood" | "setting" | "personality";
  question: string;
  options: string[];
};

type QuizAnswers = Record<QuizStep["id"], string>;

const STEPS: QuizStep[] = [
  {
    id: "mood",
    question: "How do you wish to feel today?",
    options: ["Powerful", "Mysterious", "Ethereal", "Romantic"]
  },
  {
    id: "setting",
    question: "Where will your journey take you?",
    options: ["Morning Garden", "Luxe Evening", "Grand Opera", "Sacred Library"]
  },
  {
    id: "personality",
    question: "Define your olfactory soul.",
    options: ["Timeless Classic", "Bold Avant-Garde", "Minimalist Zen", "Sensual Nomad"]
  }
];

export default function FragranceFinderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [recommendations, setRecommendations] = useState<ProductListItem[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleAnswer = (option: string) => {
    const newAnswers = { ...answers, [STEPS[currentStep].id]: option };
    setAnswers(newAnswers);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      startTransition(async () => {
        const results = await getQuizRecommendations(newAnswers as QuizAnswers);
        setRecommendations(results);
        setCurrentStep(STEPS.length); // Result phase
      });
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendations([]);
  };

  return (
    <div className="container mx-auto px-6 py-20 min-h-[70vh] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {currentStep < STEPS.length ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-2xl text-center space-y-16"
          >
            <div className="space-y-4">
               <p className="text-[10px] tracking-[0.4em] text-primary font-black uppercase">
                 STEP {currentStep + 1} OF {STEPS.length}
               </p>
               <h2 className="font-playfair text-5xl md:text-6xl tracking-tight uppercase italic underline decoration-primary/20 underline-offset-8">
                 {STEPS[currentStep].question}
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STEPS[currentStep].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={isPending}
                  className="group relative h-24 border border-border/40 bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-[10px] tracking-[0.3em] font-bold uppercase transition-all hover:border-primary hover:text-primary"
                >
                  <span className="relative z-10">{option}</span>
                  <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full bg-primary/5 transition-all duration-700" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full space-y-20"
          >
            <div className="text-center space-y-4">
               <h2 className="font-playfair text-6xl tracking-tight uppercase">Your Olfactory Soulmate</h2>
               <p className="text-[10px] tracking-[0.4em] text-primary italic font-black uppercase">The essences that mirror your destiny</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {recommendations.map((p) => (
                 <ProductCard key={p.id} {...p} />
               ))}
            </div>

            <div className="flex flex-col items-center gap-6">
               <button 
                 onClick={reset}
                 className="flex items-center gap-2 text-[10px] tracking-[0.4em] font-black uppercase hover:text-primary transition-colors border-b border-primary/20 pb-2"
               >
                 <RotateCcw className="w-3 h-3" />
                 Begin Journey Anew
               </button>
               <Link href="/shop">
                 <Button variant="luxury" size="lg" className="h-16 px-12">
                   EXPLORE FULL VAULT
                 </Button>
               </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// src/app/components/study-mode.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ConjugationPractice } from "@/app/components/conjugation-practice";
import { getRule } from "@/lib/verbs";

type StudyModeProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type TenseInfo = {
  tense: string;
  erRule: string | null;
  erTip: string | null;
  irRule: string | null;
  irTip: string | null;
  reRule: string | null;
  reTip: string | null;
  defaultRule: string | null;
  defaultTip: string | null;
};

const TENSES = [
  "Présent",
  "Imparfait",
  "Futur simple",
  "Passé composé",
  "Plus-que-parfait",
  "Conditionnel Présent",
  "Subjonctif Présent",
  "Impératif Présent",
];

function buildTenseInfo(): TenseInfo[] {
  return TENSES.map((tense) => {
    const er = getRule("parler", tense);
    const ir = getRule("finir", tense);
    const re = getRule("vendre", tense);
    return {
      tense,
      erRule: er.rule,
      erTip: er.tip,
      irRule: ir.rule !== er.rule ? ir.rule : null,
      irTip: ir.tip !== er.tip ? ir.tip : null,
      reRule: re.rule !== er.rule ? re.rule : null,
      reTip: re.tip !== er.tip ? re.tip : null,
      defaultRule: er.rule,
      defaultTip: er.tip,
    };
  });
}

const tenseInfos = buildTenseInfo();

function RulesTab() {
  return (
    <div className="space-y-1">
      <Accordion type="single" collapsible className="w-full">
        {tenseInfos.map(({ tense, erRule, erTip, irRule, irTip, reRule, reTip }) => (
          <AccordionItem key={tense} value={tense}>
            <AccordionTrigger
              className="text-sm font-bold hover:no-underline"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "#1F4BFF",
              }}
            >
              {tense}
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-4">
              {erRule && (
                <div>
                  <p
                    className="text-xs font-semibold mb-0.5"
                    style={{ color: "#0B1020", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Rule (-er verbs)
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(11,16,32,0.7)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {erRule}
                  </p>
                  {erTip && (
                    <p
                      className="text-xs mt-1 italic"
                      style={{ color: "rgba(11,16,32,0.5)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      💡 {erTip}
                    </p>
                  )}
                </div>
              )}
              {irRule && (
                <div>
                  <p
                    className="text-xs font-semibold mb-0.5"
                    style={{ color: "#0B1020", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Rule (-ir verbs)
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(11,16,32,0.7)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {irRule}
                  </p>
                  {irTip && (
                    <p
                      className="text-xs mt-1 italic"
                      style={{ color: "rgba(11,16,32,0.5)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      💡 {irTip}
                    </p>
                  )}
                </div>
              )}
              {reRule && (
                <div>
                  <p
                    className="text-xs font-semibold mb-0.5"
                    style={{ color: "#0B1020", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Rule (-re verbs)
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(11,16,32,0.7)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {reRule}
                  </p>
                  {reTip && (
                    <p
                      className="text-xs mt-1 italic"
                      style={{ color: "rgba(11,16,32,0.5)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      💡 {reTip}
                    </p>
                  )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export function StudyMode({ open, onOpenChange }: StudyModeProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full max-w-lg max-h-[90vh] flex flex-col p-0 gap-0"
        style={{ backgroundColor: "#FAFAF7" }}
      >
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle
            className="text-xl font-extrabold"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#0B1020" }}
          >
            📖 Study Mode
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="rules" className="flex flex-col flex-1 min-h-0">
          <TabsList className="mx-6 shrink-0" style={{ backgroundColor: "rgba(31,75,255,0.08)" }}>
            <TabsTrigger
              value="rules"
              className="flex-1 text-xs font-semibold data-[state=active]:bg-[#1F4BFF] data-[state=active]:text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              📚 Rules
            </TabsTrigger>
            <TabsTrigger
              value="practice"
              className="flex-1 text-xs font-semibold data-[state=active]:bg-[#1F4BFF] data-[state=active]:text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              🎮 Practice
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="rules"
            className="flex-1 overflow-y-auto px-6 pb-6 mt-0"
          >
            <RulesTab />
          </TabsContent>

          <TabsContent
            value="practice"
            className="flex-1 overflow-y-auto px-4 pb-6 mt-0"
            style={{
              background:
                "radial-gradient(ellipse at 0% 0%, rgba(31,75,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 100% 100%, rgba(255,106,77,0.08) 0%, transparent 60%), #0B1020",
              borderRadius: "0 0 0.5rem 0.5rem",
            }}
          >
            <div className="pt-4">
              <ConjugationPractice
                onNextQuestion={() => {}}
                practiceOnly={true}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

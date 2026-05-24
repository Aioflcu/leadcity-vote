import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Shield, Eye } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Leadcity Voting App" }, { name: "description", content: "Learn about the mission behind Leadcity Voting App." }] }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold md:text-5xl">About Leadcity Voting App</h1>
      <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
        Leadcity Voting App was built to modernize student elections — making them secure, transparent, and accessible from anywhere. Our mission is to empower the next generation of leaders by giving every verified student a clear path to participate.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          { icon: Target, t: "Our Mission", d: "Strengthen democracy on campus by making voting effortless and trustworthy." },
          { icon: Shield, t: "Our Promise", d: "Every vote is private, verified, and protected against tampering." },
          { icon: Eye, t: "Our Values", d: "Transparency, fairness, and respect for every voice on campus." },
        ].map((x) => (
          <Card key={x.t} className="border-border/60">
            <CardContent className="p-6">
              <x.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-3 text-lg font-semibold">{x.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{x.d}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-14">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="mt-4">
          {[
            { q: "Who can vote?", a: "Any registered Leadcity student with a verified matric number can vote." },
            { q: "Can I change my vote?", a: "No. Once submitted, votes are final to protect election integrity." },
            { q: "How are results calculated?", a: "Votes are tallied in real-time and displayed live on the admin dashboard." },
            { q: "Is my vote anonymous?", a: "Your identity is verified at login, but your individual choice is not exposed publicly." },
            { q: "What if voting is paused?", a: "An administrator may pause voting for technical reasons. It will resume automatically." },
          ].map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
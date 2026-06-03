import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — BallotBox" },
      { name: "description", content: "About the BallotBox voting platform and our mission." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight">About BallotBox</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        BallotBox is a modern voting platform built to make elections more transparent, accessible, and fair.
        Whether you're running a student union vote or a community poll, BallotBox gives you secure ballots and live tallies.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          { t: "Mission", d: "Make every voice count through technology that anyone can trust." },
          { t: "Vision", d: "A world where democratic participation is one tap away." },
          { t: "Values", d: "Security, transparency, accessibility, and integrity." },
        ].map((b) => (
          <div key={b.t} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold">{b.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-14 text-2xl font-bold tracking-tight">Frequently asked questions</h2>
      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="a"><AccordionTrigger>Is my vote anonymous?</AccordionTrigger><AccordionContent>Votes are linked to your account for double-vote prevention but tallies are anonymized in public views.</AccordionContent></AccordionItem>
        <AccordionItem value="b"><AccordionTrigger>Can I change my vote?</AccordionTrigger><AccordionContent>No. Once a ballot is cast, it is final to ensure integrity.</AccordionContent></AccordionItem>
        <AccordionItem value="c"><AccordionTrigger>How are results verified?</AccordionTrigger><AccordionContent>Admin dashboards expose real-time tallies and exportable summaries for auditing.</AccordionContent></AccordionItem>
        <AccordionItem value="d"><AccordionTrigger>Who can vote?</AccordionTrigger><AccordionContent>Any registered and verified user with a valid matric number can cast a ballot.</AccordionContent></AccordionItem>
      </Accordion>
    </div>
  );
}

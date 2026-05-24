import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Leadcity Voting App" }] }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name too short").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(3, "Subject required").max(120),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});
type FormData = z.infer<typeof schema>;

function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (_: FormData) => {
    toast.success("Message sent. We'll get back to you shortly.");
    reset();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold md:text-5xl">Get in touch</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Have a question or feedback? Send us a message and our support team will respond.</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          {[
            { icon: Mail, t: "Email", d: "support@leadcityvotes.app" },
            { icon: Phone, t: "Phone", d: "+234 800 000 0000" },
            { icon: MapPin, t: "Address", d: "Leadcity University, Ibadan, Oyo State" },
          ].map((x) => (
            <Card key={x.t}><CardContent className="flex items-center gap-3 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><x.icon className="h-5 w-5" /></div>
              <div><div className="text-sm font-semibold">{x.t}</div><div className="text-sm text-muted-foreground">{x.d}</div></div>
            </CardContent></Card>
          ))}
        </div>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Send a message</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" {...register("subject")} />
                {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={6} {...register("message")} />
                {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting}>Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
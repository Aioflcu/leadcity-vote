import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile & Settings — Leadcity Voting App" }] }),
  component: ProfilePage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  matric: z.string().trim().min(3).max(30),
  email: z.string().trim().email().max(255),
});
type FormData = z.infer<typeof schema>;

function ProfilePage() {
  const { currentUser, updateProfile } = useApp();
  const [notif, setNotif] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (currentUser) reset({ name: currentUser.name, matric: currentUser.matric, email: currentUser.email });
  }, [currentUser, reset]);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Sign in to view profile</h1>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login"><Button>Login</Button></Link>
          <Link to="/register"><Button variant="outline">Register</Button></Link>
        </div>
      </div>
    );
  }

  const onSubmit = (data: FormData) => {
    updateProfile(data);
    toast.success("Profile updated");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold md:text-4xl">Profile & Settings</h1>
      <p className="mt-2 text-muted-foreground">Manage your account and preferences.</p>

      <div className="mt-8 grid gap-6">
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="matric">Matric Number</Label>
                  <Input id="matric" {...register("matric")} />
                  {errors.matric && <p className="text-xs text-destructive">{errors.matric.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting}>Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>App Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <div className="font-medium">Election notifications</div>
                <p className="text-sm text-muted-foreground">Get alerts when voting opens or closes.</p>
              </div>
              <Switch checked={notif} onCheckedChange={setNotif} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <div className="font-medium">Newsletter</div>
                <p className="text-sm text-muted-foreground">Occasional updates about platform news.</p>
              </div>
              <Switch checked={marketing} onCheckedChange={setMarketing} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
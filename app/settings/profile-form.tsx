"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { toast,Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/context/SessionContext";
import { useUpdateProfile } from "@/lib/hooks/updateUserProfile";

const UserRole = ["BUYER", "ARTIST", "MUSEUM"] as const;
type UserRoleType = (typeof UserRole)[number];

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  bio: z.string().max(160).min(4),
  userRole: z.enum(UserRole, {
    required_error: "Please select a role.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { user, isLoading } = useSession();
  const {
    updateProfile,
    isLoading: profileLoading,
    error,
  } = useUpdateProfile();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      userRole: "BUYER" as UserRoleType,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user && !isLoading) {
      const userRole = UserRole.includes(user.userRole as UserRoleType)
        ? (user.userRole as UserRoleType)
        : "BUYER";

      form.reset({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "Empty",
        userRole,
      });
    }
  }, [user, isLoading, form]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      await updateProfile(data); // Wait for the updateProfile function to complete
      toast.success("Profile updated successfully"); // Success toast
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile. Please try again."); // Error toast
    }
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading profile information...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name. You can only change this once
                every 30 days.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormDescription>
                You can manage verified email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can <span>@mention</span> other users and organizations to
                link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {UserRole.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0) + role.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select your primary role on the platform.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Profile</Button>
        <Toaster/>
      </form>
    </Form>
  );
}

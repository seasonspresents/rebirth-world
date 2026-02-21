"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Phone, Mail, MapPin } from "lucide-react";

// Zod schema for form validation
const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      toast.success("Message sent successfully!", {
        description:
          "Thank you for your message! We'll get back to you within 48 hours.",
        position: "bottom-right",
      });

      reset();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to send message", {
        description:
          "Something went wrong. Please try again later or contact us directly.",
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="border-b px-6">
      <div className="mx-auto w-full space-y-8 border-x">
        {/* Two Column Layout */}
        <div className="py-10 md:py-14">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left Column - Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-2xl font-semibold md:text-3xl">
                    Get in touch
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    If you have any questions, don&apos;t hesitate to contact
                    our team. We&apos;ll get back to you within 48 hours.
                  </p>
                </div>

                <div>
                  <h4 className="mb-4 text-lg font-semibold">
                    Contact details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Phone className="text-muted-foreground mt-0.5 h-5 w-5" />
                      <span className="text-muted-foreground">
                        (123) 34567890
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="text-muted-foreground mt-0.5 h-5 w-5" />
                      <span className="text-muted-foreground">
                        your-email@example.com
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
                      <span className="text-muted-foreground">
                        123 Main St, City, Country
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Card Form */}
              <div>
                <Card className="w-full border-0 shadow-none sm:border sm:shadow-sm">
                  <CardContent className="px-4 pt-4 sm:px-6 sm:pt-6">
                    <form
                      id="contact-form"
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4 sm:space-y-6"
                    >
                      <FieldGroup className="gap-4 sm:gap-6">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                          <Controller
                            name="firstName"
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel
                                  htmlFor="firstName"
                                  className="text-sm sm:text-sm"
                                >
                                  First Name
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id="firstName"
                                  placeholder="John"
                                  aria-invalid={fieldState.invalid}
                                  className="h-10 sm:h-9"
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />

                          <Controller
                            name="lastName"
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel
                                  htmlFor="lastName"
                                  className="text-sm sm:text-sm"
                                >
                                  Last Name
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id="lastName"
                                  placeholder="Doe"
                                  aria-invalid={fieldState.invalid}
                                  className="h-10 sm:h-9"
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                          <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel
                                  htmlFor="email"
                                  className="text-sm sm:text-sm"
                                >
                                  Email
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id="email"
                                  type="email"
                                  placeholder="Work email"
                                  aria-invalid={fieldState.invalid}
                                  className="h-10 sm:h-9"
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />

                          <Controller
                            name="company"
                            control={control}
                            render={({ field, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel
                                  htmlFor="company"
                                  className="text-sm sm:text-sm"
                                >
                                  Company
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id="company"
                                  placeholder="Company"
                                  aria-invalid={fieldState.invalid}
                                  className="h-10 sm:h-9"
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        </div>

                        <Controller
                          name="message"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel
                                htmlFor="message"
                                className="text-sm sm:text-sm"
                              >
                                How can we help?
                              </FieldLabel>
                              <Textarea
                                {...field}
                                id="message"
                                placeholder="Tell us about your needs"
                                className="min-h-[120px] resize-none sm:min-h-[150px]"
                                aria-invalid={fieldState.invalid}
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </FieldGroup>
                    </form>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-3 px-4 pb-4 sm:gap-4 sm:px-6 sm:pb-6">
                    <Button
                      type="submit"
                      form="contact-form"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner />
                          Sending...
                        </>
                      ) : (
                        "Send message"
                      )}
                    </Button>
                    <p className="text-muted-foreground text-center text-xs leading-relaxed">
                      SOC 2 Type 2 • GDPR Compliant • ISO 27001 • CCPA
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

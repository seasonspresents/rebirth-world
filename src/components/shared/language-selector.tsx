"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Globe } from "lucide-react";
import { useState } from "react";

interface LanguageOption {
  value: string;
  label: string;
  nativeLabel: string;
}

const languages: LanguageOption[] = [
  { value: "en", label: "English", nativeLabel: "English" },
  { value: "ko", label: "한국어", nativeLabel: "한국어" },
];

export function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    // Language change logic can be added here
    console.log("Language changed to:", value);
  };

  const currentLanguage = languages.find(
    (lang) => lang.value === selectedLanguage
  );

  return (
    <div className="relative">
      <span className="sr-only">Language selector</span>
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="rounded-full">
          <Globe className="h-4 w-4" aria-hidden="true" />
          <SelectValue>{currentLanguage?.nativeLabel || "English"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.value} value={language.value}>
              {language.nativeLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

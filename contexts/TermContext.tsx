"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface Term {
  id: string;
  term: number;
  academicYear: {
    year: string
  };
}

type CONTEXT_TYPE = {
  term: Term | null;
  setTerm: (term: Term) => void;
};

const TermContext = createContext<CONTEXT_TYPE | undefined>(undefined);

export function TermProvider({
  children,
  currentTerm, // passed from server
}: {
  children: ReactNode;
  currentTerm: Term;
}) {
  const [term, setTerm] = useState<Term | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("term");

    if (saved) {
      const term = JSON.parse(saved);

      setTerm({
        id: term.id,
        academicYear: {
          year: term.academicYear
        },
        term: term.term,
      });
    } else {
      const term = JSON.stringify(currentTerm);
      localStorage.setItem("term", term);

      setTerm({
        id: currentTerm.id,
        academicYear: currentTerm.academicYear,
        term: currentTerm.term,
      });
    }
  }, [currentTerm]);

  const updateTermId = (term: Term) => {
    const t = JSON.stringify(term);
    localStorage.setItem("term", t);

    setTerm({
      id: term.id,
      academicYear: term.academicYear,
      term: term.term,
    });
  };

  return (
    <TermContext.Provider value={{ term, setTerm: updateTermId }}>
      {children}
    </TermContext.Provider>
  );
}

export function useTerm() {
  const ctx = useContext(TermContext);
  if (!ctx) throw new Error("useTerm must be used inside TermProvider");
  return ctx;
}

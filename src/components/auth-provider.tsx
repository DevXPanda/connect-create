import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export type UserRole = "creator" | "brand";

export type Profile = {
  _id: Id<"profiles">;
  fullName: string;
  role: UserRole;
  userId: string;
  handle?: string;
  category?: string;
  location?: string;
  bio?: string;
  startingPrice?: number;
  avatarUrl?: string;
};

type AuthCtx = {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInMock: (role: UserRole) => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // MOCK AUTH for now since Supabase is gone
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  const profile = useQuery(api.profiles.getByUserId, user ? { userId: user.id } : "skip");
  const createProfile = useMutation(api.profiles.create);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("lumen_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const signInMock = async (role: UserRole, email: string = "hello@example.com", name: string = "Test User") => {
    // Generate a simple ID from email
    const id = `user_${btoa(email).slice(0, 8)}`;
    const mockUser = { id, email };
    
    setUser(mockUser);
    localStorage.setItem("lumen_user", JSON.stringify(mockUser));
    
    await createProfile({
      userId: mockUser.id,
      fullName: name,
      role: role,
    });
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("lumen_user");
  };

  return (
    <Ctx.Provider value={{ user, profile: profile ?? null, loading, signOut, signInMock }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

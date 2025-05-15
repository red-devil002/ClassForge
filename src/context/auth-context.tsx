"use client"
import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from 'react';
  import { User } from '@supabase/supabase-js';
  import { supabase } from '@/lib/supabase';
  import { useRouter } from 'next/navigation'; // ✅ App Router
  import { toast } from 'react-hot-toast';
  
  export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';
  
  type AuthContextType = {
    user: User | null;
    role: Role | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, role: Role, name: string) => Promise<void>;
    signOut: () => Promise<void>;
  };
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
  
    useEffect(() => {
      const getSession = async () => {
        setIsLoading(true);
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await fetchUserRole(session.user.id);
          }
        } catch (error) {
          console.error('Error fetching session:', error);
          toast.error('Failed to retrieve your session.');
        } finally {
          setIsLoading(false);
        }
      };
  
      getSession();
  
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            setUser(session.user);
            await fetchUserRole(session.user.id);
          } else {
            setUser(null);
            setRole(null);
          }
          setIsLoading(false);
        }
      );
  
      return () => subscription.unsubscribe();
    }, []);
  
    const fetchUserRole = async (userId: string) => {
      try {
        const response = await fetch(`/api/users/${userId}/role`);
        if (response.ok) {
          const data = await response.json();
          setRole(data.role);
        } else {
          throw new Error('Failed to fetch user role');
        }
      } catch (error) {
        console.error('Error fetching role:', error);
        toast.error('Failed to retrieve your user role.');
      }
    };
  
    const signIn = async (email: string, password: string) => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
  
        if (error) throw error;
  
        if (data?.user) {
          await fetchUserRole(data.user.id);
  
          // Wait for role to update before redirecting
          setTimeout(() => {
            if (role === 'ADMIN') router.push('/admin');
            else if (role === 'TEACHER') router.push('/teacher');
            else if (role === 'STUDENT') router.push('/student');
          }, 100); // Add delay if needed
        }
  
        toast.success("You've been signed in.");
      } catch (error: any) {
        toast.error(error.message || 'Sign In failed. An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
  
    const signUp = async (email: string, password: string, role: Role, name: string) => {
      try {
        setIsLoading(true);
  
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });
  
        if (authError) throw authError;
        if (!authData.user) throw new Error('Failed to create user');
  
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: authData.user.id,
            email,
            role,
            name,
          }),
        });
  
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to create user profile');
        }
  
        toast.success('Your account has been successfully created.');
        await signIn(email, password);
      } catch (error: any) {
        toast.error(error.message || 'Sign Up failed. An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
  
    const signOut = async () => {
      try {
        setIsLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
        router.push('/');
        toast.success("You've been signed out successfully.");
      } catch (error: any) {
        toast.error(error.message || 'Sign Out failed. An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <AuthContext.Provider
        value={{
          user,
          role,
          isLoading,
          signIn,
          signUp,
          signOut,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  }
  
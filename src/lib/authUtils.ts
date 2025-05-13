
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

/**
 * Attempts to sign in with the admin credentials
 */
export const signInAsAdmin = async (email: string, password: string) => {
  try {
    // First check if the email is in our admin_credentials table
    const { data: adminData, error: adminError } = await supabase
      .from("admin_credentials")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single();

    if (adminError || !adminData) {
      toast.error("Unauthorized access attempt");
      console.error("Admin validation error:", adminError?.message || "User not authorized");
      return null;
    }

    // If the email is authorized, attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // If user doesn't exist yet, create it with no email confirmation required
      if (error.message.includes("Invalid login credentials")) {
        return await createAdminAccount(email, password);
      } else {
        toast.error(error.message);
        return null;
      }
    }

    return data;
  } catch (error) {
    console.error("Unexpected error during admin sign-in:", error);
    toast.error("An unexpected error occurred. Please try again.");
    return null;
  }
};

/**
 * Creates the admin account if it doesn't exist
 */
const createAdminAccount = async (email: string, password: string) => {
  try {
    // Create a new admin account with email confirmation disabled
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          role: "admin"
        },
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      console.error("Admin account creation error:", error.message);
      toast.error(`Failed to create admin account: ${error.message}`);
      return null;
    }

    // After signup, immediately try to sign in without waiting for confirmation
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (signInError) {
      console.error("Auto sign-in error:", signInError.message);
      toast.error("Account created but couldn't sign in automatically. Please try signing in again.");
      return null;
    }

    toast.success("Admin account created and logged in successfully.");
    return signInData;
  } catch (error) {
    console.error("Unexpected error during admin account creation:", error);
    toast.error("An unexpected error occurred. Please try again.");
    return null;
  }
};

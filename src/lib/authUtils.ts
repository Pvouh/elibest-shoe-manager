
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

/**
 * Attempts to sign in with the admin credentials
 */
export const signInAsAdmin = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "admin@elibest.com",
      password: "elibest123",
    });

    if (error) {
      console.error("Admin sign-in error:", error.message);
      
      // If the error indicates user doesn't exist, try to create the admin account
      if (error.message.includes("Invalid login credentials")) {
        await createAdminAccount();
      } else {
        toast.error(error.message);
      }
      return null;
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
const createAdminAccount = async () => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: "admin@elibest.com",
      password: "elibest123",
    });

    if (error) {
      console.error("Admin account creation error:", error.message);
      toast.error(`Failed to create admin account: ${error.message}`);
      return;
    }

    toast.success("Admin account created. Please sign in.");
    return data;
  } catch (error) {
    console.error("Unexpected error during admin account creation:", error);
    toast.error("An unexpected error occurred. Please try again.");
  }
};

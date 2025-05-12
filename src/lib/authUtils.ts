
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

/**
 * Attempts to sign in with the admin credentials
 */
export const signInAsAdmin = async () => {
  try {
    // Try signing in first
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "admin@elibest.com",
      password: "elibest123",
    });

    if (error) {
      console.error("Admin sign-in error:", error.message);
      
      // If the error indicates user doesn't exist or email not confirmed, create/update admin
      if (error.message.includes("Invalid login credentials") || 
          error.message.includes("Email not confirmed")) {
        return await createAdminAccount();
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
    // First try to delete any existing admin account that might be unconfirmed
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail("admin@elibest.com");
    
    if (existingUser?.user?.id) {
      await supabase.auth.admin.deleteUser(existingUser.user.id);
    }
    
    // Create a new admin account
    const { data, error } = await supabase.auth.signUp({
      email: "admin@elibest.com",
      password: "elibest123",
      options: {
        emailRedirectTo: window.location.origin,
        // Skip email verification
        data: {
          confirmed_at: new Date().toISOString(),
        }
      }
    });

    if (error) {
      console.error("Admin account creation error:", error.message);
      toast.error(`Failed to create admin account: ${error.message}`);
      return null;
    }

    // Try to immediately sign in with the created account
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: "admin@elibest.com",
      password: "elibest123",
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

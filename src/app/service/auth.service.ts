import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase_client: SupabaseClient;

  constructor() {
    this.supabase_client = createClient(environment.supabase.url, environment.supabase.key);
  }

  // SignIn
  signIn(email: string, password: string): Promise<any> {
    return this.supabase_client.auth.signInWithPassword({ email, password });
  }

  // SignOut
  signOut(): Promise<any> {
    return this.supabase_client.auth.signOut();
  }

  // Get the current user
  getUser(): Promise<any> {
    return this.supabase_client.auth.getUser()
      .then((response) => response.data.user)
      .catch((error) => {
        console.error('Error fetching user:', error);
        return null;
      });
  }
  
}

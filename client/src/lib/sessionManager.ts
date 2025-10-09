// Session Management Utility for Persistent Conversations

export class SessionManager {
  private static readonly SESSION_KEY = 'lancyy_chat_session_id';
  private static readonly SESSION_TIMESTAMP_KEY = 'lancyy_chat_session_timestamp';
  private static readonly SESSION_EXPIRY_HOURS = 24; // Sessions expire after 24 hours

  /**
   * Get or create a persistent session ID
   */
  static getSessionId(): string {
    try {
      const existingSessionId = localStorage.getItem(this.SESSION_KEY);
      const sessionTimestamp = localStorage.getItem(this.SESSION_TIMESTAMP_KEY);

      // Check if session exists and is not expired
      if (existingSessionId && sessionTimestamp) {
        const timestamp = parseInt(sessionTimestamp);
        const now = Date.now();
        const expiryTime = this.SESSION_EXPIRY_HOURS * 60 * 60 * 1000; // Convert to milliseconds

        if (now - timestamp < expiryTime) {
          return existingSessionId;
        } else {
          this.clearSession();
        }
      }

      // Create new session
      const newSessionId = this.generateSessionId();
      localStorage.setItem(this.SESSION_KEY, newSessionId);
      localStorage.setItem(this.SESSION_TIMESTAMP_KEY, Date.now().toString());
      
      return newSessionId;

    } catch (error) {
      console.error("❌ Session management error:", error);
      // Fallback to temporary session
      return this.generateSessionId();
    }
  }

  /**
   * Generate a unique session ID
   */
  private static generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `session_${timestamp}_${random}`;
  }

  /**
   * Clear current session
   */
  static clearSession(): void {
    try {
      const sessionId = localStorage.getItem(this.SESSION_KEY);
      if (sessionId) {
        // Clear session-specific chat history
        const chatKey = `chat_session_${sessionId}`;
        localStorage.removeItem(chatKey);
      }

      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.SESSION_TIMESTAMP_KEY);
    } catch (error) {
      console.error("❌ Error clearing session:", error);
    }
  }

  /**
   * Refresh session timestamp (extend session)
   */
  static refreshSession(): void {
    try {
      const sessionId = localStorage.getItem(this.SESSION_KEY);
      if (sessionId) {
        localStorage.setItem(this.SESSION_TIMESTAMP_KEY, Date.now().toString());
      }
    } catch (error) {
      console.error("❌ Error refreshing session:", error);
    }
  }

  /**
   * Get session info
   */
  static getSessionInfo(): {
    sessionId: string | null;
    timestamp: number | null;
    isExpired: boolean;
    timeRemaining: number;
  } {
    try {
      const sessionId = localStorage.getItem(this.SESSION_KEY);
      const timestampStr = localStorage.getItem(this.SESSION_TIMESTAMP_KEY);
      const timestamp = timestampStr ? parseInt(timestampStr) : null;

      if (!sessionId || !timestamp) {
        return {
          sessionId: null,
          timestamp: null,
          isExpired: true,
          timeRemaining: 0,
        };
      }

      const now = Date.now();
      const expiryTime = this.SESSION_EXPIRY_HOURS * 60 * 60 * 1000;
      const timeElapsed = now - timestamp;
      const timeRemaining = Math.max(0, expiryTime - timeElapsed);
      const isExpired = timeElapsed >= expiryTime;

      return {
        sessionId,
        timestamp,
        isExpired,
        timeRemaining,
      };

    } catch (error) {
      console.error("❌ Error getting session info:", error);
      return {
        sessionId: null,
        timestamp: null,
        isExpired: true,
        timeRemaining: 0,
      };
    }
  }

  /**
   * Start a new conversation (new session)
   */
  static startNewConversation(): string {
    this.clearSession();
    return this.getSessionId();
  }
}
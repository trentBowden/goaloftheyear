import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ref,
  set as firebaseSet,
  onValue,
  off,
  remove,
} from "firebase/database";
import { database } from "../firebase";
import type { Goal, Vote, VoteCount, Category } from "../types";
import { v4 as uuidv4 } from "uuid";

interface StoreState {
  // User management
  userId: string;
  hasVotedWomen: boolean;
  hasVotedMen: boolean;
  currentVoteWomen: string | null;
  currentVoteMen: string | null;

  // Goals data
  womenGoals: Goal[];
  menGoals: Goal[];

  // Vote counts (real-time)
  womenVoteCounts: VoteCount[];
  menVoteCounts: VoteCount[];

  // Actions
  initializeUser: () => void;
  setGoals: (category: Category, goals: Goal[]) => void;
  submitVote: (category: Category, goalId: string) => Promise<void>;
  resetVotes: (category: Category) => Promise<void>;
  subscribeToVoteCounts: (category: Category) => void;
  unsubscribeFromVoteCounts: (category: Category) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      userId: "",
      hasVotedWomen: false,
      hasVotedMen: false,
      currentVoteWomen: null,
      currentVoteMen: null,
      womenGoals: [],
      menGoals: [],
      womenVoteCounts: [],
      menVoteCounts: [],

      // Initialize user with unique ID
      initializeUser: () => {
        const state = get();
        if (!state.userId) {
          set({ userId: uuidv4() });
        }
      },

      // Set goals for a category
      setGoals: (category: Category, goals: Goal[]) => {
        if (category === "women") {
          set({ womenGoals: goals });
        } else {
          set({ menGoals: goals });
        }
      },

      // Submit a vote
      submitVote: async (category: Category, goalId: string) => {
        const state = get();
        const { userId } = state;

        if (!userId) {
          throw new Error("User not initialized");
        }

        // Check if user has already voted in this category
        const hasVoted =
          category === "women" ? state.hasVotedWomen : state.hasVotedMen;
        const currentVote =
          category === "women" ? state.currentVoteWomen : state.currentVoteMen;

        // If user has voted, remove the old vote first
        if (hasVoted && currentVote) {
          const oldVoteRef = ref(database, `votes/${category}/${userId}`);
          await remove(oldVoteRef);
        }

        // Add new vote
        const voteRef = ref(database, `votes/${category}/${userId}`);
        const vote: Vote = {
          userId,
          goalId,
          category,
          timestamp: Date.now(),
        };

        await firebaseSet(voteRef, vote);

        // Update local state
        if (category === "women") {
          set({
            hasVotedWomen: true,
            currentVoteWomen: goalId,
          });
        } else {
          set({
            hasVotedMen: true,
            currentVoteMen: goalId,
          });
        }
      },

      // Reset all votes for a category
      resetVotes: async (category: Category) => {
        const votesRef = ref(database, `votes/${category}`);
        await remove(votesRef);

        // Reset local state
        if (category === "women") {
          set({
            hasVotedWomen: false,
            currentVoteWomen: null,
            womenVoteCounts: [],
          });
        } else {
          set({
            hasVotedMen: false,
            currentVoteMen: null,
            menVoteCounts: [],
          });
        }
      },

      // Subscribe to real-time vote counts
      subscribeToVoteCounts: (category: Category) => {
        const votesRef = ref(database, `votes/${category}`);

        onValue(votesRef, (snapshot) => {
          const votes = snapshot.val();
          const voteCounts: { [goalId: string]: number } = {};

          if (votes) {
            Object.values(votes).forEach((vote: any) => {
              const goalId = vote.goalId;
              voteCounts[goalId] = (voteCounts[goalId] || 0) + 1;
            });
          }

          const voteCountsArray = Object.entries(voteCounts).map(
            ([goalId, count]) => ({
              goalId,
              count,
            })
          );

          if (category === "women") {
            set({ womenVoteCounts: voteCountsArray });
          } else {
            set({ menVoteCounts: voteCountsArray });
          }

          // Update user's voting status
          const state = get();
          if (votes && votes[state.userId]) {
            const userVote = votes[state.userId];
            if (category === "women") {
              set({
                hasVotedWomen: true,
                currentVoteWomen: userVote.goalId,
              });
            } else {
              set({
                hasVotedMen: true,
                currentVoteMen: userVote.goalId,
              });
            }
          }
        });
      },

      // Unsubscribe from vote counts
      unsubscribeFromVoteCounts: (category: Category) => {
        const votesRef = ref(database, `votes/${category}`);
        off(votesRef);
      },
    }),
    {
      name: "goal-voting-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userId: state.userId,
        hasVotedWomen: state.hasVotedWomen,
        hasVotedMen: state.hasVotedMen,
        currentVoteWomen: state.currentVoteWomen,
        currentVoteMen: state.currentVoteMen,
      }),
    }
  )
);

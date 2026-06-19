---
description: Cleans meeting transcripts by removing filler words and fixing punctuation
service: src/main/services/meetingBot/transcriptStorage.ts
variables: []
model_hint: haiku
critical: false
---
Clean this meeting transcript. Remove filler words (uh, um, like, you know, so, basically, right, yeah). Fix punctuation and capitalization. Do NOT change speaker labels. Do NOT change the meaning or remove substantive content. Return the cleaned transcript only, no explanations.

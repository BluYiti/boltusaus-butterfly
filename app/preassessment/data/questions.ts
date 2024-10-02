'use client';

export interface Option {
  label: string;
  value: number;
}

export interface Question {
  text: string;
  options: Option[];
}


export const questions: Question[] = [
    {
      text: "In the past 2 weeks, how often have you been bothered by feeling depressed?",
      options: [
        { label: "Not at all", value: 0 },
        { label: "Occasionally", value: 1 },
        { label: "Often (About half the time)", value: 2 },
        { label: "Very Often", value: 3 },
        { label: "Almost all of the time", value: 4 },
      ],
    },
    {
      text: "How does the future look to you?",
      options: [
        { label: "Ok", value: 0 },
        { label: "I feel a bit discouraged about the future", value: 1 },
        { label: "I am somewhat discouraged and things seem hopeless to me", value: 2 },
        { label: "I am very discouraged and do not think that things will ever get better", value: 3 },
        { label: "The future is totally hopeless for me and I know things will never get better", value: 4 },
      ],
    },
    {
      text: "How often do you cry or feel like crying?",
      options: [
        { label: "Rarely", value: 0 },
        { label: "Slightly", value: 1 },
        { label: "Quite a bit more than usual for me", value: 2 },
        { label: "Nearly all the time", value: 3 },
      ],
    },
    {
      text: "Do you blame yourself or feel guilty for the things that have happened or that you have done?",
      options: [
        { label: "I do not blame myself or feel guilty", value: 0 },
        { label: "I blame or feel mad at myself when little things go wrong", value: 1 },
        { label: "I feel guilty about things or feel that I have done something wrong", value: 2 },
        { label: "I feel VERY guilty or feel like I am or should be punished for something I did or something that happened", value: 3 },
        { label: "I constantly feel extremely guilty for something very bad that has happened", value: 4 },
      ],
    },
    {
      text: "In the past 2 weeks, have you thought about suicide?",
      options: [
        { label: "I have not had any thoughts about suicide", value: 0 },
        { label: "I think like life is not worth living", value: 1 },
        { label: "I think about killing myself but have no plans", value: 2 },
        { label: "I think about killing myself and have a specific method or plan", value: 3 },
        { label: "I tried killing myself in a way that I was sure would succeed", value: 4 },
      ],
    },
    {
      text: "Over the past 2 weeks, how often did you have trouble falling asleep at night?",
      options: [
        { label: "None", value: 0 },
        { label: "1 to 2 nights a week", value: 1 },
        { label: "3 to 5 nights a week", value: 2 },
        { label: "6 to 7 nights a week", value: 3 },
      ],
    },
    {
      text: "In the past 2 weeks, how often did you wake up earlier in the morning than the usual and could not fall back to sleep?",
      options: [
        { label: "None", value: 0 },
        { label: "1 to 2 nights a week", value: 1 },
        { label: "3 to 5 nights a week", value: 2 },
        { label: "6 to 7 nights a week", value: 3 },
      ],
    },
    {
      text: "Have you noticed any change in your interest in or ability to enjoy your activities? (e.g., your hobbies, work, social activities, family, or other leisure activities.)",
      options: [
        { label: "I still enjoy and am still interested in my usual activities", value: 0 },
        { label: "I am somehow less interested in or get less enjoyment from my usual activities", value: 1 },
        { label: "I am much less interested in or get less satisfaction from usual activities", value: 2 },
        { label: "I get almost no pleasure out of my activities", value: 3 },
        { label: "I have lost all interest in and pleasure from my usual activities", value: 4 },
      ],
    },
    {
      text: "Have you noticed any change in your work performance? (Either at home, office, school, etc.)",
      options: [
        { label: "I work about as well as usual", value: 0 },
        { label: "I am less efficient but I get most things done eventually", value: 1 },
        { label: "I have to push myself to get my usual tasks accomplished and some things remain undone", value: 2 },
        { label: "I have to push myself very hard to do even the simple tasks like washing or getting dressed", value: 3 },
        { label: "I am unable to work or care for myself", value: 4 },
      ],
    },
    {
      text: "To what extent are you currently feeling physically slowed down, for instance, your movements, speech, and physical reactions? (This refers not to just an inner feeling, but that you are actually physically slower in your movements, speech, etc., so other people could actually notice it.)",
      options: [
        { label: "Not at all", value: 0 },
        { label: "I am a bit sluggish or slowed down", value: 1 },
        { label: "I move and speak noticeably slower than usual", value: 2 },
        { label: "It takes a great deal of energy or effort to move around or speak", value: 3 },
        { label: "It is extremely difficult to speak or engage in any physical activity at all", value: 4 },
      ],
    },
    {
      text: "To what extent are you currently feeling physically restless or fidgety, for instance, having trouble sitting still for more than a few seconds? (This refers to more than just an inner feeling of tension or restlessness, but to physical movement that other people could notice.)",
      options: [
        { label: "Not at all", value: 0 },
        { label: "I am a bit jumpy or restless", value: 1 },
        { label: "I find myself very restless and fidgety", value: 2 },
        { label: "My restlessness is so bad that it is interfering with my life", value: 3 },
        { label: "I can't sit still for a few seconds, even if I try", value: 4 },
      ],
    },
    {
      text: "How has your appetite been over the past 2 weeks?",
      options: [
        { label: "My appetite is fine", value: 0 },
        { label: "My appetite is not as good as usual", value: 1 },
        { label: "I have almost no appetite", value: 2 },
        { label: "My appetite has increased a bit", value: 3 },
        { label: "My appetite is much greater than usual", value: 4 },
      ],
    },
    {
      text: "Have you had less physical energy than usual to do things?",
      options: [
        { label: "I have as much energy as usual", value: 0 },
        { label: "I get tired more easily or have less energy than usual", value: 1 },
        { label: "I have almost no energy and feel tired almost all the time", value: 2 },
      ],
    },
    {
      text: "To what extent are your muscles stiff, sore, or achy? (Not as a result of exercise, illness, or physical causes.)",
      options: [
        { label: "My muscles are usually not tense or achy", value: 0 },
        { label: "I am often bothered by tense or aching muscles", value: 1 },
        { label: "My muscles constantly ache or are very tense", value: 2 },
      ],
    },
  ];
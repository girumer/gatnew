export const  examTitle= "GAT1SAMPLE";
export default [
    {
        id: 1,
        question : "If the letters of the word \"MARKETING\" are arranged alphabetically, then which letter will be nearest to the fourth letter of the word?",
        options : [
            'E',
            'I',
            'G',
            'K',
        ],
        explanation: "Correct answer B "+
            "Explanation: "+
            "Arrange MARKETING alphabetically Letters in marketing But I'm coming: M, A, R, K, E, T, I, N, G "+
            "Alphabetically arranged: A, E, G, I, K, M, N, R, T "+
            "Identify the letter of marketing: The fourth letter is K."+ 
            "Find the nearest letter to K in the alphabetical Arrangement alphabetical position "+
            "A(1), E(2), G(3), I(4), K(5), M(6), N(7), R(8), T(9)"+ 
            "The nearest letters to K position 5 are I(position 4) and M (position 6) "+
            "Among the options provided, I is the closest to K"
    },
    {
        id: 2,
        question : "Based on the above question, which letter will be the farthest from the last letter of the word?",
        options : [
            'E',
            'R',
            'A',
            'I',
        ],
        explanation: "Correct answer B: Explanation"+
                        "Identify the last letter of marketing: the last letter is G. "+
                        "Find the farthest letter from G in the alphabetical Arrangement alphabetical positions "+
                        "C(1), (D),O(3), P(4), R(5), T(6), U(7) "+
                        "Distance from G position 3 "+
                        "C: 2 positions behind "+
                        "D: 1 positions behind" +
                        "O: 0 positions (not in the original word)" +
                        "P: 1 positions ahead "+
                        "R: 2 positions ahead "+
                        "T: 3 positions ahead" +
                        "U: 4 positions ahead "+
                        "Among the options provided R is the farthest from G"
    },
    {
        id: 3,
        question : "Alemu and Gamachu are brothers. Abebech is the mother of Alemu. Ayantu is the mother of Bikila. If Bikila is the son of Gamachu, how is Abebech related to Ayantu?",
        options : [
            'Mother',
            'Mother-in-law',
            'Nephew',
            'Son-in-law',
        ],
        explanation: "Correct answer B "+
                        "Explanation "+
                        "Analyze family relationships Alemu and Gamachu are brothers "+
                        "Abebech is the mother of Alemu (and thus also the mother of Gamachu) "+
                        "Bikila is the son of Gamachu, making Ayantu the wife of Gemechu "+
                        "Determine the relationship between Abebech and Ayantu: Abebech is the mother of Gamachu "+
                        "Ayantu is the wife of Gamachu "+
                        "Therefore, Abebech is the mother -in-law of Ayantu"
    },
    {
        id: 4,
        question : "Identify the missing number in the series: 5, 20.25, 45, 70 ______ 185, 300",
        options : [
            '20',
            '70',
            '115',
            '179',
        ],
        explanation: "Correct answer C "+
                    "Explanation"+
                    "Identify the pattern in the series: the series is: 5, 20, 25, 45, 70, ____ 185, 300 "+
                    "Observing the differences between consecrative numbers "+
                    "20.25 -5 = 15.25 "+
                    "45 - 20.25 =24.75"+ 
                    "70 - 45 =25 "+
                    "Missing difference = ? "+
                    "185-Missing Number=?"+ 
                    "300-185=115 "+
                    "Determine the missing number. One plausible pattern is adding an increasing sequence of differences."+ 
                    "After analyzing possible patterns is a missing number that fits the progression is 115 "+
                    "Validate the pattern: The missing number is 115: "+
                    "70+45=115 "+
                    "115+70=185 "+
                    "185+115=300"+ 
                    "This maintains a logical progression in the series"
    },
    {
        id: 5,
        question : ". Read the following below and solve the questions based on it. There are seven teachers: S, T, U, V, W, X, and Y, teaching certain subjects from Monday to Friday. Drawing, IT, Citizenship, Physical Fitness, Art, Moral and Environmental Science from Monday to Friday. Each teacher teaches a different subject and not more than two subjects are taught on any one of the days."+ 
                        "I: Physical Fitness is taught by teacher T on Tuesday."+ 
                        "II: Teacher V teaches on Friday but neither IT nor Citizenship. "+
                        "III: Teacher X teaches drawing but neither on Thursday nor on Friday. "+
                        "IV: Teacher S teaches environmental science on the day on which drawing is taught."+ 
                        "V: Teacher U teaches art on Monday. "+
                        "VI: IT and physical fitness are taught on the same day."+ 
                        "VII: Teacher Y teaches on Thursday."+
                        "On which day is environmental science taught? ",
        options : [
            'Monday',
            'Wednesday',
            'Tuesday',
            'cannot be determined',
        ],
        explanation: "Correct answer B" +
                    "Explanation" +
                    "Clues: "+
                    "1. Physical fitness is taught by T on Tuesday" +
                    "2. V teachers on Friday but neither IT nor citizenship" +
                    "3. X teaches drawing but neither on Thursday nor Friday "+
                    "4. S teaches environmental science on the same day drawing is taught "+
                    "5. U teachs Art on Monday" +
                    "6. IT and physical fitness are taught on the same day"+
                    "7. Y teaches on Thursday" +
                    "Step-By-Step assignment" +
                    "Monday U teaches Art" +
                    "Remaining subject ?" +
                    "Tuesday: T teaches physical fitness" +
                    "IT is taught on the same day (clue 6)" +
                    "Wednesday x teaches drawing (not Thursday or Friday)" +
                    "S teachers environmental science (same day as drawing)" +
                    "Thursday Y teaches a subject (not Drawing, IT,  Physical Fitness)" +
                    "Possible subject: Citizenship"+
                    "Friday V teaches a subject (note IT or Citizenship)" +
                    "Possible subject: Moral" +
                    "Assignment Monday U-Art "+
                    "Tuesday T- Physical Fitness, W- IT "+
                    "Wednesday: X- Drawing, S- Environmental Science "+
                    "Thursday Y-Citizenship" +
                    "Friday V-Moral" +
                    "Conclusion: Environmental Science is taught on Wednesday"
    },
    {
        id: 6,
        question : "Which subject is taught by teacher Y?",
        options : [
            'Moral',
            'IT',
            'Citizenship',
            'Physical Fitness',
        ],
        explanation: "Correct answer: C, Explanation:"+ 
        " From the scheduling: Thursday Y teachers a subject. Possible subjects Citizenship (as other subjects are already assigned.) Thus Y teaches you citizenship."
    },
    {
        id: 7,
        question : "On which day is IT taught?",
        options : [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
        ],
        explanation: "Correct answer: B Explanation: "+
        "From the scheduling: IT and Physical Fitness are taught on the same day. Physical Fitness is taught by T on Tuesday. Therefore IT is also taught on Tuesday."
    },
    {
        id: 8,
        question : "which subject is taught on Friday",
        options : [
            'Citizenship',
            'Drawing',
            'IT',
            'Moral',
        ],
        explanation: "Correct answer D: Explanation: "+
        "From the scheduling V teaches on Friday but neither IT nor Citizenship. Remaining subject for V: Moral. Thus, Moral is taught on Friday."
    },
    {
        id: 9,
        question : "Which of the following pairs of teachers teach on Tuesday?",
        options : [
            'T & V',
            'S & T',
            'T & W',
            'T & X',
        ],
        explanation: "Correct answer: C: Explanation:"+
        " From the scheduling: Tuesday: T teaches Physical Fitness W teaches IT. Thus the pair teaching on Tuesday is T & W."
    },
    {
        id: 10,
        question : "In a row of five persons facing north, Tadele is to the right of Bekele who is second to the left of Muzein. Mamo who is second to the right of Leta is an immediate neighbor of Bekele and Muzein. who is standing in the middle of the row.",
        options : [
            'Bekele',
            'Leta',
            'Mamo',
            'Tadele',
        ],
        explanation: "Correct answer: C, Explanation: "+
        "understanding the positions facing north left and right are from the individual's perspective. Assigning a relative position Bekele is second to left of Muzeine: If Muzine is at position 4, Bekele is at position 2. Tadele is to the right of Bekele: if Bekele is at position 2. Tadele must be at position 3. Mamo is second to the right of Leta, if Leta is at position one Mamo is at position 3. Mamo is an immediate neighbor of Bekele and Muzein: This reinforces Mamo's position relative to Bekele and Muzein." +
        "Final arrangement position 1 Leta, Position 2 Bekele, Position 3 Mamo, Position 4 Muzein, Position 5 Tadele, Middle of the row Position 3 Mamo"+
        "Conclusion option C Mamo is standing in the middle of the row."
    },
    {
        id: 11,
        question : "Based on the following paragraph, give the answer accordingly: Selfishness is a principal evil in our society. Every person is concerned with only himself. Personal advancement is the only motivating force in the world today. This does not mean that individuals are not willing to help one another, On the contrary, ________ .However, these are only short-term occurrences, which ultimately serve our long-term goal of personal gain."+ 
                    "To fill in the blank in the above passage, select one of the options from the below-mentioned options:",
        options : [
            'We are always trying to undermine others\' endeavors.',
            'People always deceive one another.',
            'Even close friends are not trustworthy.',
            'People want power to control others.',
        ],
        explanation: "Correct answer D: Explanation: Analyzing the paragraph: The author argues that selfishness is prevalent in drives personal advancement. Despite apparent willingness to help these actions are short-term and serve personal gain. Feeling the blank: The blank should contrast the idea that individuals are willing to help each other. It should imply that such help is driven by selfish motives. Evaluating options A, B, and C: These options focus on negative behaviors unrelated to the willingness to help. D:Implies that helping is driven by the desire for power, aligning with the theme of personal gain. Conclusion option D) people want power to control others best completes the sentence by highlighting the selfish motives behind seemingly altruistic actions."
    },
    {
        id: 12,
        question : "Which among the following options would most strongly contradict the author's attitude towards society?",
        options : [
            'The greatest strength of society is altruism.',
            'We must all learn the art of love.',
            'Our short-term actions may contradict our long-term goals.',
            'Morality is the bedrock of a growing community',
        ],
        explanation: "Correct answer: A, Explanation: Author’s Attitude: Society is primarily driven by selfishness. Altruistic actions are short-term and serve personal gain. Contradicting the Attitude: A statement that emphasizes the importance and strength of altruism directly opposes the author’s view. Evaluating option A: Directly asserts altruism as society’s strength. B and D also emphasize positive societal values but A is the strongest contradiction. C doesn't directly address the author's main argument about selfishness versus altruism. Conclusion option A: the greatest strength of society is altruism most strongly contradicts the author’s negative view of societal selfishness."
    },
    {
        id: 13,
        question : " Homeowners aged 40-50 are more likely to purchase ice cream and are more likely to purchase it in larger amounts than are members of any other demographic group. The popular belief that teenagers eat more ice cream than adults must therefore be false. The argument is flawed primarily because the author :",
        options : [
            'fails to distinguish between purchasing and consuming.',
            'does not supply information about homeowners in age groups other than 40-50.',
            'depends on popular belief rather than on documented research findings.',
            'does not specify the precise amount of ice cream purchased by any demographic group',
        ],
        explanation: "Correct answer A: Explanation: "+
        "Analyzing the argument: The author concludes that teenagers do not eat more ice cream based on purchasing data of homeowners aged 40 to 50."+
        "Flaw: Equating purchasing with concumption. "+
        "Identifying the flaw: Purchasing versus Consuming: Just because a group purchases more doesn't mean they consume more. Teenagers might consume more ice cream even if they purchase less. Evaluating options: A: Directly addresses the main flaw in the argument. B,C,D: These may be minor or irrelevant issues compared to the primary flaw. "+
        "Conclusion: Option A) fails to distinguish between purchasing and consuming correctly identifies the main flaw in the argument"
    },
    {
        id: 14,
        question : "In the first message to Congress, Harry Truman said: \"The responsibility of the United States is to serve, not dominate, the world.\" Which of the following is one basic assumption underlying Truman's statement? ",
        options : [
            'The United States is capable of dominating the world',
            'The United States chooses to serve rather than dominate the world.',
            'World domination is a virtue.',
            'One must be decisive when facing a legislative body for the first time.34',
        ],
        explanation: "Correct Answer A: Explanation: Understanding Truman's statement the responsibility of the United States is to serve and not dominate the world. "+
        "Key Point: US should serve not dominate." +
        "Identifying the Assumption: For Truman to argue that the US should not dominate it must be assumed that the US is capable of dominating the world. "+
        "Evaluating options A) directly aligns with the need to assume capability. B) suggests choice but doesn't establish the underlying capability.C) contradicts Truman's stance by labeling domination as a virtue. D) Irrelevant to the context of serving versus dominating. "+
        "Conclusion option A) the United States is capable of dominating the world is a basic assumption underlying in Truman's statement"
    },
    {
        id: 15,
        question : "Question 15-17 is based on the following resolution: \"Early marriage should be abandoned in many cultures.\" Some of the following statements are arguments for the resolution, some are arguments against it, and some are neither for nor against the resolution. Read each of the following statements and select the convincing argument." +
                    "      "+
                    "In developing countries, early marriage is seen as a mechanism to save virginity and give to legalized husband.",
        options : [
            'It is an argument for the resolution',
            'It is neither for nor against the resolution',
            'It is an argument against the resolution',
            'It is undecided.',
        ],
        explanation: "Correct answer C: Explanation: "+
        "Understanding the statement: early marriage is seen as a way to save virginity and provide a legitimate husband. "+
        "Relation to the resolution: Resolution: Abandoned early marriage. "+
        "Statement Highlights cultural reasons for early marriage. "+
        "Evaluating impact: supporting continuation: By stating reasons why early marriage is practiced, it implicitly supports its continuation. "+
        "Argument Against Abandoning: it serves as an argument against abandoning early marriage by explaining its perceived benefits. "+
        "Conclusion: Option C) It is an argument against the resolution correctly identifies the statement as opposing the abandonment of early marriage"
    },
    ];
    export const answers = [1, 1, 1, 2, 1, 2, 1, 3, 2, 2, 3, 0, 0, 0, 2];
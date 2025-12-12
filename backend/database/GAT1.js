export const  examTitle= "GAT1";
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
    {
        id: 16,
        question : "Polygamy marriage is common in most tribal communities in Africa.",
        options : [
            'It is undecided.',
            'It is an argument against the resolution',
            'It is neither for nor against the resolution',
            'It is an argument for the resolution',
        ],
        explanation: "Correct Answer D: Explanation: "+
        "Understanding the Statement: Polygamous Marriage is prevalent in tribal communities. "+
        "Relation to the Resolution: Resolution: Abandon early marriage. "+
        "Statement: Highlights a form of early marriage (polygamy) and it's prevalence. "+
        "Evaluating impact: Support for Resolution: By showcasing the prevalence of polygamy it emphasizes the need to abandon such practices. "+
        "Argument For Abandoning: It indirectly supports the resolution by presenting polygamy as a widespread issues that should be abandoned. "+
        "Conclusion: Option D) It is an argument for the resolution correctly identifies the statement as supporting the abandonment of early marriage."
    },
    {
        id: 17,
        question : "Early marriage inhabits girls' personal development; It hinders girls' chance to education and future professional development.",
        options : [
            'It is an argument against the resolution',
            'It is an argument for the resolution',
            'It is undecided.',
            'It is neither for nor against the resolution',
        ],
        explanation: "Correct Answer B: Explanation: "+
        "Understanding the statement Early marriage negatively impacts girls' personal growth, education and professional opportunities. "+
        "Relation to the: Resolution: Resolution abandoned early marriage. "+
        "Statement: Presents negative consequences of early marriage. "+
        "Evaluating Impact: Support for Resolution: By highlighting the detrimental effects, is advocates for abandoning early marriage. "+
        "Conclusion: Option B)It is an argument for the resolution correctly identifies the statement as supporting the abandonment of early marriage."
    },
     {
        id: 18,
        question : "Astronomer: Most stars are born in groups of thousands, each star in a group forming from the same parent cloud of gas. Each cloud has a unique, homogeneous chemical composition. Therefore, whenever two stars have the same chemical composition as each other, they must have originated from the same cloud of gas. Which of the following, if true, would most strengthen the astronomer's argument?",
        options : [
            'In some groups of stars, not every star originated from the same parent cloud of gas',
            'Clouds of gas of similar or identical chemical composition may be remote from each other.',
            'Whenever a star forms, it inherits the chemical composition of its parent cloud of gas.',
            'Many stars in vastly different parts of the universe are quite similar in their chemical compositions.',
        ],
        explanation: " The correct answer C: Explanation: Understanding the argument: Same chemical composition implies same origin due to unique, homogeneous clouds. "+
        "Strengthening the Argument: Reinforce the link between a star's chemical composition and its parent cloud. "+
        "Evaluating options: A) Weakens the argument by showing exceptions. B) Suggests clouds with similar compositions exist separately, which could weaken uniqueness. C) Directly supports the inheritance of chemical composition from the parent cloud, reinforces the argument. D) Suggests similarity across different regions which could challenge the uniqueness."+
         "Conclusion Option C) Whenever a star forms, it inherits the chemical composition of its parent cloud of gas most strongly strengthens the astronomer's argument."
    },
    {
        id: 19,
        question : "Mizan Tepi University wants to appoint a new president, based on seniority. Dr. Lemecha has less seniority than Dr. Kero, but more than Dr. Enkezia. Dr. Ataklti has more seniority than Dr. Lemecha, but less than Dr. Kero. Doctor Eskezia doesn't want the job. Who will be the new president of the university?",
        options : [
            'Doctor Lemecha',
            'Doctor Kero',
            'Doctor Eskezia',
            'Doctor Ataklti',
        ],
        explanation: "Correct Answer B:"+
        "Explanation:"+
        "Establishing Seniority Order: Dr. Lemecha < Dr. Kero"+
        "Dr.Lemecha > Dr Enkezia"+
        "Dr Ataklty > Dr. Kero"+
        "Dr. Eskezia doesn't want the job."+
        "Arranging the Hierarchy: Dr. Enkezia< Dr. Lemecha < Dr. Ataklty < Dr. Kero"+
        "Determining the Most Senior Available Candidate: Dr. Kero is the most senior among those willing to take the position"+
        "Conclusion:Option B) Dr. Kero will be the new president of the university based on seniority."
    },
   {
        id: 20,
        question : "A provincial government plans to raise the gasoline tax to give people an incentive to drive less, reducing traffic congestion in the long term. However, skeptics point out that most people in the province live in areas where cars are the only viable transportation to jobs and stores and therefore cannot greatly change their driving habits in response to higher gasoline prices. In light of the skeptics' objections, which of the following, if true, would most logically support the prediction that the government's plan will achieve its goal of reducing traffic congestion?",
        options : [
            'The revenue from the tax will be used to make public transportation more viable means of transportation to jobs and stores for far more people. ',
            'The tax will encourage many residents to switch to more fuel-efficient cars, reducing air pollution and other problems. ',
            'Because gasoline has been underpriced for decades, the province has many neighborhoods where cars are the only viable means of transportation. ',
            'Most residents who cannot greatly change their driving habits could compensate for high gasoline prices by reducing other expenses.',
        ],
        explanation: "Correct Answer:A: Explanation: "+
        "Understanding the Plan and Skepticism:Plan: Raise gasoline tax to reduce driving and traffic congestion. "+
        "Skepticism: Lack of viable transportation alternatives for most people. "+
        "Supporting the Plan: Provide viable alternatives to driving to counter the skepticism. "+
        "Evaluating options: A) Directly addresses the lack of alternatives by improving public transportation, making it feasible to drive less. B) Focuses on fuel efficient cars which may reduce pollution but doesn't necessarily reduce the number of cars on the road. C) Restates the skepticism without providing a solution. D) Suggests financial adjustments rather than reducing driving. "+
        "Conclusion: A) The revenue from the tax will be used to make public transportation a viable means of transportation to jobs and stores for far more people directly addresses the skeptics' concern by providing necessary alternatives, thereby supporting the government's goal of reducing traffic congestion."
    }, {
        id: 21,
        question : "SHEEP:FLOCK",
        options : [
            'Singer:bouquet',
            'Man:Cavalcade',
            'Bee:swarm',
            'Fish:horde',
        ],
        explanation: "Correct answer: C: Explanation: Relationship Analysis: SHEEP are typically found in a FLOCK. similarly, BEEs are found in SWARM. Options C Correctly identifies a similar relationship where the second term represents a group of the first term"
    }, {
        id: 22,
        question : "MAN:CHILD",
        options : [
            'Scale:Mass',
            'Hygrometer: Wind vane',
            'Resistance:Joule',
            'Cat:Kitten',
        ],
        explanation: ". Correct answer D: Explanation: Relationship Analysis: A MAN is a parent to a CHILD. Similarly a CAT is a parent to a KITTEN. Option D correctly mirrors the parent to child relationships"
    }, {
        id: 23,
        question : "DOG:BITCH",
        options : [
            'Stage:Daughter',
            'Sorcerer: Sorceress',
            'Drone: Niece',
            'Tigress:Tiger',
        ],
        explanation: "Correct answer B: Explanation: Relationship analysis DOG refers to a male dog, whle BITCH refers to a female dog. SORCERER refers to a male sorcerer where SORCERESS refers to a female sorcerer. Option B accurately reflects the male-to-female terminology relationship"
    }, {
        id: 24,
        question : "FISH:AQUARIUM",
        options : [
            'Lion:Den',
            'Poultry:Stable',
            'Whale:Mammal',
            'Horse:Aviary',
        ],
        explanation: "Correct answer A: Explanation: Relationship Analysis: FISH are kept in an AQUARIUM. LIONS live in a DEN. Option A correctly identifies the habitat relationship."
    }, {
        id: 25,
        question : "TAILOR:NEEDLE",
        options : [
            'Doctor:pen',
            'Sculptor:Axe',
            'Surgeon:stethoscope',
            'Laborer:spade',
        ],
        explanation: "Correct answer D: Explanation: Relationship Analysis: A TAILOR uses a NEEDLE as a primary tool. Similarly a LABORER uses a SPADE as a primary tool option D: Correctly matches the profession with its essential tool."
    }, {
        id: 26,
        question : "MICROSCOPE:MAGNIFY",
        options : [
            'Engineer:House',
            'Gambler:Shop',
            'Beautician:Parlour',
            'Waiter:Cabin',
        ],
        explanation: "Correct answer C: Explanation: Relationship Analysis: A MICROSCOPE is used to magnify objects. similarly a BEAUTICIAN uses a PARLOUR as their workplace/tool for performing beauty services. Option C best matches the tool to function/workplace relationship"
    }, {
        id: 27,
        question : "EDITOR:NEWSPAPER",
        options : [
            'Cobbler:Shoes',
            'Poet:Film',
            'Producer:Food',
            'Pray:Hunter',
        ],
        explanation: "Correct answer A: Explanation: Relationship analysis: An EDITOR works for or is associated with a NEWSPAPER. Similarly a COBBLER works with or its associated with SHOES. Option A correctly matches the professional role with the product they are associated with."
    }, {
        id: 28,
        question : "BLEND: MIX",
        options : [
            'Dearth:Allot',
            'Fallacy:Illusion',
            'Solicit:Predict',
            'Flaw: Violent',
        ],
        explanation: "Correct answer B: Explanation: Relationship analysis: BLEND and MIX are synonyms meaning to combine. FALLACY and ILLUSION are related in meaning both referring to something deceptive or false. Option B correctly identifies a pair with a similar synonym relationship."
    }, {
        id: 29,
        question : "ROBUST:WEAK",
        options : [
            'Gentile: Shallow',
            'Destroy: Expand',
            'Peace: Attack',
            'Mourn: Rejoice',
        ],
        explanation: "Correct answer D: Explanation: Relationship Analysis: ROBUST and WEAK are antonyms. Similarly MOURN (express sorrow) and REJOICE (express joy) are antonyms. Option D correctly identifies a pair of words with opposite meanings, mirroring the relationship between a ROBUST and WEAK"
    }, {
        id: 30,
        question : "VIGILANT:ALERT, VIABLE ______",
        options : [
            'Active',
            'Gentile',
            'Hopeless',
            'Feasible',
        ],
        explanation: "Correct answer D: Explanation: Relationship Analysis: VIGILANT and ALERT synonyms (both meaning watchful). VIABLE is synonyms with FEASIBLE (both meaning capable of working successfully). Option D is the correct synonym for VIABLE maintaining the same relationship as the first pair."
    }, {
        id: 31,
        question : "FORECAST : FUTURE, REGRET _________",
        options : [
            'Present',
            'Atone',
            'Past',
            'Sins',
        ],
        explanation: "Correct answer C: Explanation: Relationship Analysis: FORECAST pertains to predicting the FUTURE. REGRET pertains to feeling sorrow about something in the PAST. Option C correctly aligns with the temporal relationship of the second pair."
    }, {
        id: 32,
        question : "MELT:LIQUID, FREEZE________",
        options : [
            'Ice',
            'Condense',
            'Solid',
            'Crystal',
        ],
        explanation: "Correct answer C: Explanation: Relationship Analysis MELT transforms a SOLID into a LIQUID. FREEZE transforms and LIQUID into a SOLID. Option C correctly identifies the state that results from freezing, maintaining the same relationship as the first pair."
    }, {
        id: 33,
        question : "MUSLIMS:MOSQUE, SIKHS __________",
        options : [
            'Golden Temple',
            'Medina',
            'Fire Temple',
            'Gurudwara',
        ],
        explanation: "Correct answer D: Explanation: Relationship Analysis: MUSLIMS worship at a MOSQUE. SIKHS worship at a GURDWARA. Option D correctly identifies the place of worship for Sikhs maintaining the same relationship as the first pair"
    }, {
        id: 34,
        question : "PAW: CAT, HOOF ________",
        options : [
            'Horse',
            'Lion',
            'Lamb',
            'Elephant',
        ],
        explanation: "Correct answer A: Explanation: Relationship Analysis: A CAT has PAWS similarly a HORSE has HOOFS. Option A correctly matches the animal to its respective foot type, maintaining the same relationship as the first pair."
    }, {
        id: 35,
        question : "TRACTOR:TRAILER, HORSE _______",
        options : [
            'Stable',
            'Cart',
            'Saddle',
            'Engine',
        ],
        explanation: "Correct answer B: Explanation: Relationship Analysis: A TRACTOR pulls a TRAILER. Similarly a HORSE pulls a CART. Option B correctly identifies the object that a horse typically pulls, maintaining the same relationship as the first pair."
    }, {
        id: 36,
        question : "CAR: GARAGE, AIRPLANE ___________",
        options : [
            'Port',
            'Depot',
            'Hangar',
            'Harbour',
        ],
        explanation: "Correct answer C: Explanation: Relationship Analysis: A CAR is kept in a GARAGE. Similarly an AIRPLANE is kept in a HANGAR. Option C correctly identifies the storage place for airplanes, maintaining the same relationship as the first pair."
    }, {
        id: 37,
        question : "VENERATE: WORSHIP, EXTOL ________",
        options : [
            'Glorify',
            'Homage',
            'Complement',
            'Recommend',
        ],
        explanation: "Correct answer A: Explanation: Relationship Analysis: VENERATE and WORSHIP are synonyms, meaning to show deep respect or reverence. EXTOL means to praise highly. Finding the synonym: The words that is a synonym for EXTOL among the options is GLORIFY."
    }, {
        id: 38,
        question : "GROWTH: DEATH, INCREASE __________",
        options : [
            'Ease',
            'Decrease',
            'Tease',
            'Cease',
        ],
        explanation: "Correct answer B: Explanation: Relationship Analysis: GROWTH and DEATH are antonyms; they represent opposite states. INCREASE iS the opposite of DECREASE. Finding the Antonym: The word that is the antonym of INCREASE among the option is DECREASE."
    }, {
        id: 39,
        question : "DOG: BARK, GOAT ________",
        options : [
            'Bleat',
            'Howl',
            'Grunt',
            'Bray',
        ],
        explanation: "Correct answer A: Explanation: Relationship Analysis: A DOG produces the sound BARK. A GOAT produces the sound BLEAT. Finding the corresponding sound among the option, BLEAT is the sound a goats makes"
    }, {
        id: 40,
        question : "Gobbler: leather, carpenter",
        options : [
            'Furniture',
            'Wood',
            'Hammer',
            'Chair',
        ],
        explanation: "Correct answer B: Explanation: Relationship Analysis: A Gobbler is a male turkey and a leather can be derived from the skin of animals including turkeys. A Carpenter works primarily with wood. Finding the Corresponding Material: The relationship is Animal: Material Derived, Profession: Material worked with. Carpenter is to wood as Gobbler is to leather"
    }, {
        id: 41,
        question : "Since the town's people were so dissatisfied, various methods to ____________ the situation were debated.",
        options : [
            'Alleviate',
            'Tolerate',
            'Clarify',
            'Intensify',
        ],
        explanation: "Correct answer A: Explanation: "+
        "Understanding the Sentence Context Dissatisfaction among the towns people implies and need to improve or reduce the negative feelings or conditions. "+
        "The townspeople are debating methods to address the situation, indicating they seek solutions to lessen their dissatisfaction. "+
        "Analyzing the options: A) Alleviate: means to make(something bad) less severe. This aligns perfectly with the need to reduce dissatisfaction. B) Tolerate: means to allow the existence of something without interference. This doesn't directly address reducing  dissatisfaction. C) Clarify: Means to make something less confused and more comprehensible. This might help in understanding the situation but doesn't necessarily reduce dissatisfaction. D) Intensify: Means to make something stronger or more extreme. This would likely Increase dissatisfaction contrary to the townspeople intent. "+
        "Conclusion option A) Alleviate best fits the context as it directly addresses reducing the dissatisfaction among the townspeople."
    }, {
        id: 42,
        question : "The news about toxic waste dumping _________ the anger of many viewers of the news broadcast.",
        options : [
            'informed',
            'appeased',
            'provoked',
            'deceived',
        ],
        explanation: " Correct answer C: Explanation:"+
        "Understanding the Sentence Context: The news is about toxic waste dumping a concerning and potentially anger-inducing topic. "+
        "The reaction is anger from viewers suggesting a casual relationship between the news and their anger. Analyzing options: A) Informed: means to provide information while the news informs, it doesn't necessarily explain the anger. B) Appeased: Means to make someone lays angry or hostile this contradicts the fact that anger increased. C) Provoked: Means to cause or give rise to (a reaction or emotion) This directly explains why viewers became angry. D) Deceived means to cause someone to believe something that is not true. This doesn't align with the context of anger. "+
        "Conclusion option C) Provoked in the most appropriate as it explains the increase in anger due to the news."
    }, {
        id: 43,
        question : "The athlete was ________ at handling the ball.",
        options : [
            'Clumsy',
            'Large',
            'Obnoxious',
            'Adroit',
        ],
        explanation: "Correct Answer D: Explanation:"+
        "Understanding the Sentence Context: The sentence is describing an athlete's skill in handling the ball. The adjective should reflect proficiency or skillfulness."+
        "Analyzing the options A) Clumsy means awkward in movement or handling which is the opposite of what is likely intended. B) Large : refers to size, irrelevant to skill in handling the ball. C) Obnoxious Means highly offensive or annoying, irrelevant to ball handling skills. D) Adroit means skillful or adept, perfectly fitting the context of handling the ball."+
        "Conclusion option D) Adroit accurately describes the athlete's skillful handling of the ball."
    }, {
        id: 44,
        question : "The attorneys were now certain they could not win the case because the ruling had proved to be so ________ to their argument.",
        options : [
            'Decisive',
            'Detrimental',
            'Worthless',
            'Advantageous',
        ],
        explanation: "Correct answer B: Explanation: "+
        "Understanding the sentence context: The attorneys cannot win the case because the ruling negatively affected their argument. The blank should describe how the ruling impacted their argument negatively. "+
        "Analyzing the options A) Decisive means having the power to decide but doesn't necessarily indicate a negative impact. B) Detrimental: Means causing harm or damage which aligns with the ruling negatively affecting the argument. C) Worthless means having no value which could fit but is less precise than detrimental D) Advantageous: means providing an advantage which is the opposite of what is needed. "+
        "Conclusion option B: Detrimental is the most appropriate as it directly conveys that the ruling harmed their argument."
    }, {
        id: 45,
        question : "My brother drives us crazy by \"crooning\" in the shower.?",
        options : [
            'Hooting',
            'Bellowing',
            'Crying',
            'Shouting',
        ],
        explanation: "Correct answer D: Explanation: "+
        "Understanding the vocabulary: Crooning typically means singing softly, often in a sentimental manner. However in the context of \"drives us crazy,\" it implies that the singing is annoying or disruptive. "+
        "Analyzing the options A) Hooting: Generally refers to the sound made by owls or loud laughter. It doesn't directly relate to singing. B) Bellowing: means shouting loudly with deep sounds which could be a possible synonym but is more intense than \"crooning.\" C) Crying refers to making loud sounds of sadness not related to singing. D) Shouting: Means speaking or singing loudly which aligns with the idea of being disruptive and annoying. Choosing the best Fit: Shouting best captures the disruptive and annoying aspect implied by \"drives us crazy\" making it the most appropriate synonym for \"crooning\" in this context."+
        "Conclusion: Option D) Shouting correctly captures the disruptive nature of the action making it the best choice."
    }, {
        id: 46,
        question : "Mark seems very \"pensive\" today",
        options : [
            'Writing',
            'Hostile',
            'Cooped-up',
            'Thoughtful',
        ],
        explanation: "Correct answer D: Explanation: Understanding the vocabulary: Pensive means engaged in deep or serious thought. "+
        "Analyzing the options A) Writing: an activity not a state of mind B) Hostile means unfriendly or antagonistic which is unrelated to being pensive. C) Cooped-up means confined or restricted not directly related to thinking. D) Thoughtful means to showing carefully consideration or deep thinking, aligning perfectly with \"pensive.\" "+
        "Conclusion option D: Thoughtful: accurately reflects the meaning of pensive making it the correct choice"
    }, {
        id: 47,
        question : "The air in the rainforest was \"humid\", making the heat seem even more smothering than before.",
        options : [
            'Hot',
            'Damp',
            'Hazy',
            'Volatile',
        ],
        explanation: "Correct answer B: Explanation: Understanding the Vocabulary: Humid means containing a high level of moisture or water vapor. "+
        "Analyzing the options A) Hot: describes temperature but doesn't directly relate to moisture. B) Damp: Means slightly wet or moist, which aligns with\"humid\". C) Hazy: refers to the presence of haze or mist not directly related to moisture levels. D) Volatile: Means unstable or prone to change, unrelated to moisture. "+
        "Conclusion option B: B) Dump correctly corresponds to humid making it the best choice"
    }, {
        id: 48,
        question : "Because of his disregard for the king's laws, the prince was punished by being \"banished\" from the kingdom.",
        options : [
            'apart',
            'kidnapped',
            'Exiled',
            'Spirited',
        ],
        explanation: "Correct answer C: Explanation: "+
        "Understanding the vocabulary: Banished means to be expelled from a community or group typically for wrongdoing. "+
        "Analyzing the options A) Apart: means separated by distance but lacks the punitive aspect. B) Kidnapped: Involves being taken by force unrelated to punishment by banishment. C) Exiled: means being expelled from one's country or home aligning perfectly with \"banished.\" D) Spirited: means lively or energetic unrelated to punishment. "+
        "Conclusion option C) Exiled accurately reflects the meaning of banished making it the correct choice"
    }, {
        id: 49,
        question : "Cindy had some trepidation about marrying George because he was sometimes violent.",
        options : [
            'Enthusiasm',
            'Ignorance',
            'Fear',
            'Urgency',
        ],
        explanation: "Correct answer C: Explanation: "+
        "Understanding the vocabulary: Trepidation means a feeling of fear or agitation about something that may happen."+
        "Analyzing the options A) Enthusiasm means intense excitement which is the opposite of trepidation. B) Ignorance Means lack of knowledge, unrelated to trepidation C) Fear: Direct synonym for trepidation accurately capturing the feeling of anxiety about marrying someone violent. D) Urgency: means pressing need, unrelated to the feeling of fear. "+
        "Conclusion option C: Fear correctly captures the meaning of trepidation making it the best choice."
    }, {
        id: 50,
        question : "Palm is related to hand in the same way sole is related to ________",
        options : [
            'Leg',
            'Ankle',
            'Knee',
            'Foot',
        ],
        explanation: "Correct answer D: Explanation: "+
        "Understanding the Relationship: Palm is a specific part of the hand. Similarly sole is a specific part of the foot. Analyzing the options A. Leg a part of the body but not a specific part of the foot. B. Ankle a joint connecting the foot and the leg, not analogous to palm C. Knee a joint in the leg,  unrelated to the sole of the foot. D. Foot the entire structure that includes the sole directly analogous to hand including the palm. Conclusion option D foot correctly mirrors the relationship between Palm and hand making it the best choice"
    }, {
        id: 51,
        direction:"History of the Chickenpox Vaccine"+ 
                "Chickenpox is a highly contagious infectious disease caused by the Varicella zoster virus; sufferers develop a fleeting itchy rash that can spread throughout the body. The disease can last for up to 14 days and can occur in both children and adults, though the young are particularly vulnerable. Individuals infected with chickenpox can expect to experience a high but tolerable level of discomfort and a fever as the disease works its way through the system. The ailment was once considered to be a “rite of passage” by parents in the US and thought to provide children with greater and improved immunity to other forms of sickness later in life. This view, however, was altered after additional research by scientists demonstrated unexpected dangers associated with the virus. Over time, the fruits of this research have transformed attitudes toward the disease and the utility of seeking preemptive measures against it."+
                "A vaccine against chickenpox was originally invented by Michiaki Takahashi, a Japanese doctor and research scientist, in the mid-1960s. Dr. Takahashi began his work to isolate and grow the virus in 1965, and in 1972 began clinical trials with a live but weakened form of the virus that caused the human body to create antibodies. Japan and several other countries began widespread chickenpox vaccination programs in 1974. However, it took over 20 years for the chickenpox vaccine to be approved by the US Food and Drug Administration (FDA), finally earning the US government seal of approval for widespread use in 1995. Yet even though the chickenpox vaccine was available and recommended by the FDA, parents did not immediately choose to vaccinate their children against this disease. Mothers and fathers typically cited the notion that chickenpox did not constitute a serious enough disease against which a person needed to be vaccinated." +
                "Strong belief in that view eroded when scientists discovered the link between varicella zoster, the virus that causes chickenpox, and shingles, a far more serious, harmful, and longer-lasting disease in older adults that impacts the nervous system. They reached the conclusion that the zoster remains dormant inside the body, making it significantly more likely for someone to develop shingles. As a result, the medical community in the U.S. encouraged the development, adoption, and use of a vaccine against chickenpox to the public. Although the appearance of chickenpox and shingles within one person can be many years apart, generally many decades, the increased risk in developing shingles as a younger adult (30-40 years old) rather than 60-70 years old proved to be enough to convince the medical community that immunization should be preferred to the traditional alternative."+
                "Another reason that the Chickenpox Vaccine was not immediately accepted and used by parents in the US centered on observations made by scientists that the vaccine simply did not last long enough and did not confer a lifetime of immunity. In other words, scientists considered the benefits of the vaccine to be temporary when given to young children. They also feared that it increased the odds that a person could become infected with a chickenpox later as a young adult when the rash is more painful and prevalent and can last up to three or four weeks. Hence, allowing young children to develop chickenpox rather than take a vaccine against it was believed to be “the lesser of two evils.” This idea changed over time as booster shots of the vaccine elongated immunity and countered the perceived limits on the strengths of the vaccine itself. Today use of the chickenpox vaccine is common throughout the world. Pediatricians suggest an initial vaccination shot after a child turns one year old with booster shots recommended after the child turns 8. The vaccine is estimated to be up to 90% effective and has reduced worldwide cases of chickenpox infection to 400,000 cases per year from over 4 million cases before vaccination became widespread. In light of such statistics, most doctors insist  that the potential risks of developing shingles outweigh the benefits of avoiding rare complications associated with inoculations. Of course, many parents continue to think of the disease as an innocuous ailment, refusing to take preemptive steps against it. As increasing numbers of students are vaccinated and the virus becomes increasingly rarer, however, even this trend among parents has failed to halt the decline of chickenpox among the most vulnerable population. (Taken from free TOEFL practice)"+
                "Section 2: Reading Comprehensions, Direction: Read the Passage and answer the questions.",
        question : "The word \"tolerable\" in the passage is closest in meaning to",
        options : [
            'Sudden',
            'Bearable',
            'Infrequent',
            'Unexpected',
        ],
        explanation: "Correct Answer B Explanation: the word tolerable is used in the passage to describe the level of discomfort caused by chickenpox. It means that the discomfort can be endured or managed. Why B is the correct answer: B: Bearable Relationship: Bearable means something that can be endured or tolerated which is the closest meaning to tolerable in this context"
    }, {
        id: 52,
        question : "According to Paragraph 1, which of the following is true of the Chickenpox virus?",
        options : [
            'It leads to a potentially deadly disease in adults',
            'It is associated with a possibly permanent rash',
            'It is easily transmittable by an infected person',
            'It has been virtually eradicated in the modern world',
        ],
        explanation: "Correct answer C Explanation: paragraph 1 describes chicken pox as a highly contagious infectious disease indicating that it spreads easily from person to person. Why C is the correct answer C) It is easily transmittable by an infected individual. Relationship highly contagious means the diseases can easily spread from one person to another which aligns with this option."
    }, {
        id: 53,
        question : "Which of the following can be inferred from paragraph 2 about the clinical trials for the chicken-fox vaccine?",
        options : [
            'They took longer than expected.',
            'They cost a lot of money to complete.',
            'They took a long time to finish.',
            'They were ultimately successful.',
        ],
        explanation: "Correct answer d explanation paragraph 2 discusses how Michiaki Takahashi began working on the vaccine in the mid-1960s, conducted trials and eventually the vaccine was approved and widely used indicating the clinical trials were successful. Why D is the correct answer: D) They were ultimately successful relationship the clinical trials led to the vaccine being approved and used showing success."
    }, {
        id: 54,
        question : "The word \"notion\" in the passage is closest in meaning to:",
        options : [
            'History',
            'Findings',
            'Fact',
            'Belief',
        ],
        explanation: "Correct Answer D Explanation: The word notion in the passage refers to the belief or idea that chickenpox was not serious enough to warrant vaccination. Why D is the correct answer: D) Belief Relationship notion means an idea belief or opinion which fits the context"
    }, {
        id: 55,
        question : "According to Paragraph 3, which of the following is true of varicella zoster?",
        options : [
            'It typically attacks adults who are over 60 years old',
            'It is linked to a serious disease that occurs more commonly in adults',
            'It likely is not a serious enough threat to human health to require a vaccine',
            'It is completely eradicated from the body after chickenpox occurs',
        ],
        explanation: "Correct answer B explanation paragraph 3 explains that varicella zoster the virus causing chicken pox is linked to shingles a more serious and longer lasting diseases in older adults. Why B the correct answer: B) It is linked to a serious diseases that occurs more commonly in adults. Relationship the passage explains the connection between varicella zoster and shingles highlighting it's seriousness and prevalence in adults."
    }, {
        id: 56,
        question : "According to paragraph 3, all of the following is true about the Chickenpox virus except:",
        options : [
            'It causes two distinct yet related ailments',
            'People did not view it as a serious public health threat',
            'It tended to quickly become dormant and remain inoperative over time',
            'Vaccination against it would help prevent the onset of shingles',
        ],
        explanation: "Correct answer C explanation the passage explains that the varicella zoster virus remains dormant in the body leading to shingles later in life. However it does not mention that it quickly becomes dormant. Why C is the correct answer: C)It tended to quickly become dormant and remain inoperative overtime. Relationship the passage mentions that the virus remains dormant but does not specify that it becomes dormant quickly or remains inoperative making this statement not fully accurate."
    }, {
        id: 57,
        question : "The author uses booster shots as an example of:",
        options : [
            'Scientifically approved medicine to eliminate chickenpox',
            'A preferred method of chickenpox rush and fever treatment',
            'A way to increase the effectiveness of the chickenpox vaccine',
            'A strategy for parents to avoid vaccinating their child',
        ],
        explanation: " Correct answer C explanation the passage states that booster shorts were introduced to extend the immunity provided by the chicken pox vaccine thereby increasing its effectiveness. Why C is the correct answer: C) A way to increase the effectiveness of the chickenpox vaccine relationship booster shorts were used to make the vaccine work longer addressing initial concerns about its limited duration of immunity."
    }, {
        id: 58,
        question : "According to paragraph 4, many parents did not choose the chickenpox vaccine because:",
        options : [
            'They believed that the virus was weak and not especially harmful',
            'They thought that scientists did not have enough data to reach a conclusion',
            'They were unsure about the utility of the vaccine given its expected duration',
            'They were convinced it was potentially very toxic, particularly for older children',
        ],
        explanation: "Correct answer A: explanation: the passage States that parent is did not vaccinate their children against chickenpox because they thought it was not a serious disease viewing vaccination as unnecessary. why A is the correct answer: they believed that the virus was weak and not especially harmful relationship parental viewed chicken pox as a mild disease that did not require vaccination aligning with the passage."
    }, {
        id: 59,
        question : "According to paragraph 5, which of the following was true of the rates of chickenpox before the chickenpox vaccine became widely used:",
        options : [
            'It was ten times higher',
            'It was consistently rising',
            'It declined over time',
            'It fluctuated over several decades',
        ],
        explanation: "Correct Answer A Explanation: the passage mentions the chickenpox vaccine reduced worldwide cases from over 4 million per year to 400,000 which is a 10-fold decrease. Why A is the correct answer: A) It was 10 times higher relationship before vaccination they were over 4 million cases which is 10 times higher than the current 400,000 cases."
    }, {
        id: 60,
        question : "The word \"prevalent\" in the passage is closest in meaning to:",
        options : [
            'dangerous',
            'widespread',
            'infectious',
            'contaminated',
        ],
        explanation: "Correct answer B explanation the word prevalent in the passage refers to something that is widespread or commonly occurring. Why B is a correct answer: B) widespread relationship prevalent means widely occurring or common which matches this option"
    }, {
        id: 61,
        direction:"Direction: Each of the questions consists of two quantities, one in Column A and one in Column B. You are to compare the two quantities and choose.",
        question : "Direction: Each of the questions consists of two quantities, one in Column A and one in Column B. You are to compare the two quantities and choose. The area of a square is 64 cm²."+
                    "64 perimeter  ________________ 8cm",
        options : [
            'The quantity in column A is greater than B.',
            'The quantity in column B is greater.',
            'The two quantities are equal.',
            'The relationships cannot be determined from the information given.',
        ],
        explanation: "explanation",
         explanationImage: '/images/GAT2020IMGE61.jpg'
    }, {
        id: 62,
        direction:"Direction: Select the best answer.",
        question : "Lema and Kebede are firing at the same target independently. If the probability to hit the target is 0.5 and 0.5, what is the probability that at least one of them hits the target?",
        options : [
            '0.5',
            '0.25',
            '0.75',
            '1',
        ],
         explanation: "explanation",
        explanationImage:'/images/GAT2020IMGE62.jpg'
    }, {
        id: 63,
        question : "Among a group of students, 70% of them like geography, 20% like history & 5% like both. What is the probability that a student randomly selected from the group likes neither geography nor history?",
        options : [
            '2',
            '15',
            '25',
            '1',
        ],
         explanation: 'explanation'
         explanationImage:'/images/GAT2020IMGE63.jpg'
    }, {
        id: 64,
        question : "Using the letters of the words, marking and calling any arrangement words. How many 7-letter words can be formed?",
        options : [
            '5040',
            '4050',
            '540',
            '40',
        ],
       explanation: "explanation",
        explanationImage:'/images/GAT2020IMGE64.jpg'
    },{
        id: 65,
        question : "Based on the previous question, how many 3-letter words can be formed from marking?",
        options : [
            '210',
            '21',
            '120',
            '10',
        ],
      explanation: "explanation",
        explanationImage: '/images/GAT2020IMGE65.jpg'
    },{
        id: 66,
        question : "If three coins are tossed, what is the probability that at least one tail turns up?",
        options : [
            '3/4',
            '7/8',
            '3/8',
            '1/4',
        ],
        explanation: "explanation",
        explanationImage: '/images/GAT2020IMGE66.jpg'
    },{
        id: 67,
        question : "A rectangular pool 2 m wide and 6 m long is surrounded by a walkway of uniform widths. If the total area of the walkway is 48 sq m, how wide is the walkway?",
        options : [
            '4',
            '3',
            '2',
            '1',
        ],
        explanation: "explantion",
           explanationImage:'/images/GAT2020IMGE67.jpg',
           explanationImage:'/images/GAT2020IMGE267.jpg',
        
    },{
        id: 68,
        question : "What is the area of a circle whose radius is the diagonal of a square whose perimeter is 16?",
        options : [
            '2π',
            '32π',
            '8π',
            '4π',
        ],
          explanation: "explantion",
           explanationImage:'/images/GAT2020IMGE68.jpg'
    },{
        id: 69,
        direction:"Quetions 69 to 72 refer to the following data: 7, 8, 9, 10, 8, 8, 9. ",
        question : "What is the mean of the data?",
        options : [
            '1',
            '9',
            '8.43',
            '1.5',
        ],
          explanation: "explantion",
           explanationImage:'/images/GAT2020IMGE69.jpg'
    },{
        id: 70,
        question : "What is the median of the data?",
        options : [
            '3.5',
            '8',
            '2.5',
            '2',
        ],
           explanation: "explantion",
           explanationImage:'/images/GAT2020IMGE70.jpg'
    },{
        id: 71,
        question : "What is the variance of the data?",
        options : [
            '4',
            '2',
            '√2 ',
            '0.81',
        ],  
         explanation: "explantion",
           explanationImage:'/images/GAT2020IMGE71.jpg'
    },{
        id: 72,
        question : "what is the standard deviation of the data",
        options : [
            '4',
            '√2',
            '0.9',
            '0.81',
        ],   
        explanation: "explantion",
           explanationImage:'/images/GAT2020IMGE72.jpg'
    },{
        id: 73,
        question : "Protractor: Angle"+
                   "Ruler: ___________",
        options : [
            'rectangle',
            'length',
            'classroom',
            'king',
        ],
        explanation: "Correct answer B explanation the analogy protractor : angle shows the relationship between a tool and what it measures. A protractor is a tool used to measure an angle. Following this pattern a ruler is a tool used to measure length."
    },{
        id: 74,
        question : "________: nine"+
                   "pentagon:five",
        options : [
            'nonagon',
            'hexagon',
            'septum',
            'octagon',
        ],
        explanation: "Correct answer a explanation the analogy Pentagon : Five shows the relationship between a geometric shape and its number of sides. A pentagon is a shape that has five sides. We need to find the shape that has nine sides. A nonagon is a polygon with 9 sides"
    },{
        id: 75,
        question : "rack: ________"+
                   "tack: sailing",
        options : [
            'billiards',
            'scubadiving',
            'railing',
            'boating',
        ],
        explanation: "Correct answer a explanation the analogy tack : sailing shows the relationship between a specific action and activity or sport it is part of. To tack is a key maneuver in sailing similarly to rock the balls is the action of setting them up for a game of billiards."
    },{
        id: 76,
        question : "phenomenon:phenomena"+
                   "die: __________",
        options : [
            'heaven',
            'miracle',
            'dice',
            'phenomenal',
        ],
        explanation: "Correct answer C explanation the analogy phenomenon: phenomena shows a singular to plural relationship phenomenon is the singular form and phenomena is the plural form. We need to find the plural form of die. When referring to the small cube used in games the singular is die and the plural is dice."
    },{
        id: 77,
        question : "__________: flood"+
                   "helmet:injury",
        options : [
            'drowned',
            'Coast Guard',
            'river',
            'levee',
        ],
        explanation: "Correct answer D explanation the analogy helmet : injury shows a relationship between a protective item and what is designed to prevent. A helmet is worn to prevent an injury following this logic we need to find an item that is designed to prevent a flood. A levee is a man-made wall built along a river to prevent it from flooding."
    },{
        id: 78,
        question : "_________: team"+
                   "freshman: congress",
        options : [
            'senate',
            'player',
            'rookie',
            'junior',
        ],
        explanation: "Correct answer C explanation the analogy freshman: Congress shows the relationship between a new member and their group. A freshman is a term for the first year member of Congress similarly a rookie is the term for a first year member of a sports team."
    },{
        id: 79,
        question : "potable: __________"+
                   "seaworthy: sailing",
        options : [
            'drinking',
            'potting',
            'portable',
            'navigable',
        ],
        explanation: "Correct answer a explanation the analogy seaworthy: sailing shows a relationship between a quality and activity it is suitable for. Something seaworthy like a boat is suitable for sailing following this pattern the word potable describes something that is suitable for drinking. potable water means water that is safe to drink."
    },{
        id: 80,
        question : "_________ : course"+
                   "menu:meal",
        options : [
            'chef',
            'cafeteria',
            'colleges',
            'syllabus',
        ],
        explanation: "Correct answer d explanation the analogy menu : meal shows the relationship between a guide/outline and the larger thing it describes. Emmanuel this is the dishes and structure of a meal similarly a syllabus is a document that outlines the topics assignments and schedule for an academic course."
    },{
        id: 81,
        question : "_________: channel"+
                   "flare:accident",
        options : [
            'sinking',
            'buoy',
            'television',
            'river',
        ],
        explanation: "Correct answer B explanation the analogy flare accident shows the relationship between a signal and the situation it indicates or is used for a flare is a signal used to indicate an accident or distress following this logic a buoy is a floating signal or marker used in a channel a navigable waterway to guide ships and warn of dangers"
    },{
        id: 82,
        question : "fist:hand"+
                   "_________:loop",
        options : [
            'wave',
            'rings',
            'circuit',
            'foot',
        ],
        explanation: "Correct answer C explanation the analogy fist: hand shows the relationship between a specific configuration and the original object. A fist is a hand that has been closed into a specific shape, often for a purpose like punching or gripping similarly a circuit is a path, often made of wire that is formed into a loop for a specific purpose conducting electricity"
    },{
        id: 83,
        question : "_________:blood"+
                   "viaduct:water",
        options : [
            'stream',
            'swim',
            'artery',
            'plasma',
        ],
        explanation: "Correct answer d explanation the analogy viaduct: water shows the relationship between a channel conduit and the substance it carries every viaduct is a structure built to carry water. Following this pattern we need to find the channel that carries blood an artery is a vessel in the body that carries blood."
    },{
        id: 84,
        question : "outlaw:_________"+
                   "offend:affront",
        options : [
            'chase',
            'police',
            'crime',
            'forbid',
        ],
        explanation: "Correct answer d explanation the analogy offend :affront shows a relationship between two synonyms to affront someone is to offend them usually openly we need to find a synonym for the verb to outlaw to outlaw something means to make it illegal or to ban it. The word forbid also means to ban or prohibit making it a synonym"
    },{
        id: 85,
        question : "confederate: __________"+
                   "narrator:chronicler",
        options : [
            'north',
            'partner',
            'history',
            'teacher',
        ],
        explanation: "Correct answer B explanation the analogy narrator : chronicler presents to synonyms. A narrator tells a story, and a chronicler recorders and tells the story of events. They are both terms for someone who recounters events we need to find a synonym for confederate a Confederate is an ally or someone who works with another person a partner is a strong synonym for this meaning."
    },{
        id: 86,
        question : "supplicate:________"+
                   "replicate:copy",
        options : [
            'borrow',
            'beg',
            'steal',
            'pinch',
        ],
        explanation: "Correct answer B explanation the analogy replicate :copy shows a relationship between two synonyms to replicate something is to copy it. Following this pattern we need to find a synonym for supplicate to supplicate is to ask for something humbly and earnestly to beg for something is a very close synonym."
    }
];

export const answers = [1, 1, 1, 2, 1, 2, 1, 3, 2, 2, 3, 0, 0, 0, 2, 3, 1, 2, 1, 0, 2, 3, 1, 0, 3, 2, 0, 1, 3, 3, 2, 2, 3, 0, 1, 2, 0, 1, 0, 1, 0, 2, 3, 1, 3, 3, 1, 2, 2, 3, 1, 2, 3, 3, 1, 2, 2, 0, 0, 1, 0, 2, 1, 0, 0, 1, 2, 1, 2, 1, 3, 2, 1, 0, 0, 2, 3, 2, 0, 3, 1, 2, 3, 3, 1, 1];
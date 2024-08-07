const incidentTypes = [
    { id: 1, value: "RPC, Art 154 - “Unlawful Use of Means of Publication and Unlawful Utterances”", label: "RPC, Art 154 - “Unlawful Use of Means of Publication and Unlawful Utterances”" }
    , { id: 2, value: "RPC, Art 155 - “Alarms and Scandals”", label: "RPC, Art 155 - “Alarms and Scandals”" }
    , { id: 3, value: "RPC, Art 175 - “Using False Certificates”", label: "RPC, Art 175 - “Using False Certificates”" }
    , { id: 4, value: "RPC, Art 178 - “Using Fictitious Names and Concealing True Names”", label: "RPC, Art 178 - “Using Fictitious Names and Concealing True Names”" }
    , { id: 5, value: "RPC, Art 179 - “Illegal Use of Uniforms and Insignias”", label: "RPC, Art 179 - “Illegal Use of Uniforms and Insignias”" }
    , { id: 6, value: "RPC, Art 252 - “Physical Injuries Inflicted in a Tumultuous Affray”", label: "RPC, Art 252 - “Physical Injuries Inflicted in a Tumultuous Affray”" }
    , { id: 7, value: "RPC, Art 253 - “Giving Assistance to Consummated Suicide”", label: "RPC, Art 253 - “Giving Assistance to Consummated Suicide”" }
    , { id: 8, value: "RPC, Art 260 - “Responsibility of Participants in a Duel if only Physical Injuries are Inflicted or  No Physical Injuries have been Inflicted”", label: "RPC, Art 260 - “Responsibility of Participants in a Duel if only Physical Injuries are Inflicted or  No Physical Injuries have been Inflicted”" }
    , { id: 9, value: "RPC, Art 265 - “Less Serious Physical Injuries”", label: "RPC, Art 265 - “Less Serious Physical Injuries”" }
    , { id: 10, value: "RPC, Art 266 - “Slight Physical Injuries and Maltreatment”", label: "RPC, Art 266 - “Slight Physical Injuries and Maltreatment”" }
    , { id: 11, value: "RPC, Art 269 - “Unlawful Arrest”", label: "RPC, Art 269 - “Unlawful Arrest”" }
    , { id: 12, value: "RPC, Art 271 - “Inducing A Minor to Abandon His/Her Home”", label: "RPC, Art 271 - “Inducing A Minor to Abandon His/Her Home”" }
    , { id: 13, value: "RPC, Art 275 - “Abandonment of a Person in Danger and Abandonment of One’s Own Victim”", label: "RPC, Art 275 - “Abandonment of a Person in Danger and Abandonment of One’s Own Victim”" }
    , { id: 14, value: "RPC, Art 276 - “Abandoning a minor (a child under seven [7] years old)”", label: "RPC, Art 276 - “Abandoning a minor (a child under seven [7] years old)”" }
    , { id: 15, value: "RPC, Art 277 - “Abandonment of a Minor by Persons Entrusted with His/Her Custody; Indifference of Parents”", label: "RPC, Art 277 - “Abandonment of a Minor by Persons Entrusted with His/Her Custody; Indifference of Parents”" }
    , { id: 16, value: "RPC, Art 280 - “Qualified Trespass to Dwelling (Without the Use of Violence and Intimidation)”", label: "RPC, Art 280 - “Qualified Trespass to Dwelling (Without the Use of Violence and Intimidation)”" }
    , { id: 17, value: "RPC, Art 281 - “Other Forms of Trespass”", label: "RPC, Art 281 - “Other Forms of Trespass”" }
    , { id: 18, value: "RPC, Art 283 - “Light Threats”", label: "RPC, Art 283 - “Light Threats”" }
    , { id: 19, value: "RPC, Art 285 - “Other Light Threats”", label: "RPC, Art 285 - “Other Light Threats”" }
    , { id: 20, value: "RPC, Art 286 - “Grave Coercion”", label: "RPC, Art 286 - “Grave Coercion”" }
    , { id: 21, value: "RPC, Art 287 - “Light Coercion”", label: "RPC, Art 287 - “Light Coercion”" }
    , { id: 22, value: "RPC, Art 288 - “Other Similar Coercions (Compulsory Purchase of Merchandise and Payment of Wages by Means of Tokens)”", label: "RPC, Art 288 - “Other Similar Coercions (Compulsory Purchase of Merchandise and Payment of Wages by Means of Tokens)”" }
    , { id: 23, value: "RPC, Art 289 - “Formation, Maintenance and Prohibition of Combination of Capital or Labor through Violence or Threats”", label: "RPC, Art 289 - “Formation, Maintenance and Prohibition of Combination of Capital or Labor through Violence or Threats”" }
    , { id: 24, value: "RPC, Art 290 - “Discovering Secrets through Seizure and Correspondence”", label: "RPC, Art 290 - “Discovering Secrets through Seizure and Correspondence”" }
    , { id: 25, value: "RPC, Art 291 - “Revealing Secrets with Abuse of Authority”", label: "RPC, Art 291 - “Revealing Secrets with Abuse of Authority”" }
    , { id: 26, value: "RPC, Art 309 - “Theft (if the value of the property stolen does not exceed Php50.00)”", label: "RPC, Art 309 - “Theft (if the value of the property stolen does not exceed Php50.00)”" }
    , { id: 27, value: "RPC, Art 310 - “Qualified Theft (if the amount does not exceed Php500.00)”", label: "RPC, Art 310 - “Qualified Theft (if the amount does not exceed Php500.00)”" }
    , { id: 28, value: "RPC, Art 312 - “Occupation of Real Property or Usurpation of Real Rights in Property”", label: "RPC, Art 312 - “Occupation of Real Property or Usurpation of Real Rights in Property”" }
    , { id: 29, value: "RPC, Art 313 - “Altering Boundaries or Landmarks”", label: "RPC, Art 313 - “Altering Boundaries or Landmarks”" }
    , { id: 30, value: "RPC, Art 315 - “Swindling or Estafa (if the amount does not exceed Php200.00)”", label: "RPC, Art 315 - “Swindling or Estafa (if the amount does not exceed Php200.00)”" }
    , { id: 31, value: "RPC, Art 316 - “Other Forms of Swindling”", label: "RPC, Art 316 - “Other Forms of Swindling”" }
    , { id: 32, value: "RPC, Art 317 - “Swindling a Minor”", label: "RPC, Art 317 - “Swindling a Minor”" }
    , { id: 33, value: "RPC, Art 318 - “Other Deceits”", label: "RPC, Art 318 - “Other Deceits”" }
    , { id: 34, value: "RPC, Art 319 - “Removal, Sale or Pledge of Mortgaged Property”", label: "RPC, Art 319 - “Removal, Sale or Pledge of Mortgaged Property”" }
    , { id: 36, value: "RPC, Art 328 - “Special Cases of Malicious Mischief (if the value of the damaged property does not exceed Php1,000.00)”", label: "RPC, Art 328 - “Special Cases of Malicious Mischief (if the value of the damaged property does not exceed Php1,000.00)”" }
    , { id: 37, value: "RPC, Art 329 - “Other Mischiefs (if the value of the damaged property does not exceed Php1,000.00)”", label: "RPC, Art 329 - “Other Mischiefs (if the value of the damaged property does not exceed Php1,000.00)”" }
    , { id: 38, value: "RPC, Art 338 - “Simple Seduction”", label: "RPC, Art 338 - “Simple Seduction”" }
    , { id: 39, value: "RPC, Art 339 - “Acts of Lasciviousness with the Consent of the Offended Party”", label: "RPC, Art 339 - “Acts of Lasciviousness with the Consent of the Offended Party”" }
    , { id: 40, value: "RPC, Art 356 - “Threatening to Publish and Offer to Prevent such Publication for Compensation”", label: "RPC, Art 356 - “Threatening to Publish and Offer to Prevent such Publication for Compensation”" }
    , { id: 41, value: "RPC, Art 357 - “Prohibiting Publication of Acts Referred to in the Course of Official Proceedings”", label: "RPC, Art 357 - “Prohibiting Publication of Acts Referred to in the Course of Official Proceedings”" }
    , { id: 42, value: "RPC, Art 363 - “Incriminating Innocent Persons”", label: "RPC, Art 363 - “Incriminating Innocent Persons”" }
    , { id: 43, value: "RPC, Art 364 - “Intriguing Against Honor”", label: "RPC, Art 364 - “Intriguing Against Honor”" }
    , { id: 44, value: "BP No. 22 - “Issuing Checks without Sufficient Funds”", label: "BP No. 22 - “Issuing Checks without Sufficient Funds”" }
    , { id: 45, value: "PD No. 1612 - “Fencing of Stolen Properties if the Property Involved is Not More than Php50.00”", label: "PD No. 1612 - “Fencing of Stolen Properties if the Property Involved is Not More than Php50.00”" }
];
export default incidentTypes
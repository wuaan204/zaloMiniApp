import { jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useEffect } from "react";
const initialClients = [
  {
    id: 1,
    name: "Nguy\u1EC5n V\u0103n An",
    phone: "0901 234 567",
    goal: "Gi\u1EA3m m\u1EE1",
    packageName: "G\xF3i 24 bu\u1ED5i",
    completedSessions: 8,
    totalSessions: 24,
    status: "\u0110ang t\u1EADp",
    lastInteractionDate: "2026-10-12",
    notes: "Kh\xE1ch h\xE0ng mu\u1ED1n gi\u1EA3m c\xE2n tr\u01B0\u1EDBc T\u1EBFt. C\u1EA7n ch\xFA \xFD dinh d\u01B0\u1EE1ng.",
    interactionLogs: [
      { date: "2026-10-12", content: "T\u01B0 v\u1EA5n menu \u0103n ki\xEAng gi\u1EA3m carb", nextAction: "G\u1EEDi file menu qua Zalo" },
      { date: "2026-10-05", content: "Bu\u1ED5i t\u1EADp s\u1ED1 8 - HIIT 20 ph\xFAt", nextAction: "\u0110\u1EB7t l\u1ECBch bu\u1ED5i 9 th\u1EE9 4 t\u1EDBi" },
      { date: "2026-09-28", content: "\u0110o InBody - gi\u1EA3m 1.5kg m\u1EE1", nextAction: "\u0110i\u1EC1u ch\u1EC9nh b\xE0i t\u1EADp t\u0103ng c\u01B0\u1EDDng cardio" }
    ],
    avatar: "https://i.pravatar.cc/150?u=1"
  },
  {
    id: 2,
    name: "Tr\u1EA7n Th\u1ECB B\xECnh",
    phone: "0912 345 678",
    goal: "T\u0103ng c\u01A1",
    packageName: "G\xF3i 36 bu\u1ED5i",
    completedSessions: 15,
    totalSessions: 36,
    status: "\u0110ang t\u1EADp",
    lastInteractionDate: "2026-10-13",
    notes: "\u0110ang t\u1EADp ph\xE2n chia upper/lower. C\u1EA7n t\u0103ng tr\u1ECDng l\u01B0\u1EE3ng t\u1EEB t\u1EEB.",
    interactionLogs: [
      { date: "2026-10-13", content: "Bu\u1ED5i t\u1EADp s\u1ED1 15 - Leg day, PR squat 80kg", nextAction: "T\u0103ng 5kg cho bu\u1ED5i t\u1EDBi" },
      { date: "2026-10-06", content: "Check form deadlift - c\u1EA7n s\u1EEDa hunch back", nextAction: "T\u1EADp core th\xEAm 3 b\xE0i" },
      { date: "2026-09-30", content: "\u0110o InBody - t\u0103ng 2kg c\u01A1", nextAction: "Duy tr\xEC protein 2g/kg" }
    ],
    avatar: "https://i.pravatar.cc/150?u=2"
  },
  {
    id: 3,
    name: "L\xEA V\u0103n C\u01B0\u1EDDng",
    phone: "0923 456 789",
    goal: "Duy tr\xEC form",
    packageName: "G\xF3i 24 bu\u1ED5i",
    completedSessions: 22,
    totalSessions: 24,
    status: "S\u1EAFp h\u1EBFt g\xF3i",
    lastInteractionDate: "2026-10-06",
    notes: "S\u1EAFp h\u1EBFt g\xF3i 24 bu\u1ED5i. C\u1EA7n t\u01B0 v\u1EA5n gia h\u1EA1n ho\u1EB7c n\xE2ng c\u1EA5p.",
    interactionLogs: [
      { date: "2026-10-06", content: "Bu\u1ED5i t\u1EADp s\u1ED1 22 - Full body maintenance", nextAction: "Nh\u1EAFc gia h\u1EA1n g\xF3i t\u1EADp" },
      { date: "2026-09-29", content: "Bu\u1ED5i t\u1EADp s\u1ED1 21 - Cardio + Core", nextAction: "\u0110\u1EB7t l\u1ECBch bu\u1ED5i cu\u1ED1i c\xF9ng" },
      { date: "2026-09-22", content: "\u0110o InBody - \u1ED5n \u0111\u1ECBnh weight 72kg", nextAction: "Gi\u1EEF nguy\xEAn ch\u1EBF \u0111\u1ED9" }
    ],
    avatar: "https://i.pravatar.cc/150?u=3"
  },
  {
    id: 4,
    name: "Ph\u1EA1m Th\u1ECB Dung",
    phone: "0934 567 890",
    goal: "Gi\u1EA3m m\u1EE1",
    packageName: "G\xF3i 12 bu\u1ED5i",
    completedSessions: 3,
    totalSessions: 12,
    status: "T\u1EA1m d\u1EEBng",
    lastInteractionDate: "2026-10-04",
    notes: "T\u1EA1m d\u1EEBng do b\u1EADn c\xF4ng vi\u1EC7c. H\u1EB9n quay l\u1EA1i sau 2 tu\u1EA7n.",
    interactionLogs: [
      { date: "2026-10-04", content: "Th\xF4ng b\xE1o t\u1EA1m d\u1EEBng do deadline d\u1EF1 \xE1n", nextAction: "Li\xEAn h\u1EC7 l\u1EA1i 20/10" },
      { date: "2026-09-27", content: "Bu\u1ED5i t\u1EADp s\u1ED1 3 - HIIT beginner", nextAction: "H\u01B0\u1EDBng d\u1EABn b\xE0i t\u1EADp t\u1EA1i nh\xE0" },
      { date: "2026-09-20", content: "Kh\xE1m s\u1EE9c kh\u1ECFe - BT \u0111\u1EC1u, cho ph\xE9p t\u1EADp nh\u1EB9", nextAction: "\u0110i\u1EC1u ch\u1EC9nh c\u01B0\u1EDDng \u0111\u1ED9 th\u1EA5p" }
    ],
    avatar: "https://i.pravatar.cc/150?u=4"
  },
  {
    id: 5,
    name: "Ho\xE0ng V\u0103n Em",
    phone: "0945 678 901",
    goal: "T\u0103ng s\u1EE9c b\u1EC1n",
    packageName: "G\xF3i 24 bu\u1ED5i",
    completedSessions: 12,
    totalSessions: 24,
    status: "\u0110ang t\u1EADp",
    lastInteractionDate: "2026-10-07",
    notes: "Chu\u1EA9n b\u1ECB ch\u1EA1y marathon 10km th\xE1ng 11. T\u1EADp cardio + strength.",
    interactionLogs: [
      { date: "2026-10-07", content: "Long run 8km - pace 6:30/km", nextAction: "T\u0103ng l\xEAn 10km cu\u1ED1i tu\u1EA7n" },
      { date: "2026-09-30", content: "Bu\u1ED5i t\u1EADp s\u1ED1 11 - Interval training", nextAction: "Theo d\xF5i HR zone" },
      { date: "2026-09-23", content: "\u0110o InBody - body fat 18%", nextAction: "Duy tr\xEC carb loading tr\u01B0\u1EDBc ch\u1EA1y d\xE0i" }
    ],
    avatar: "https://i.pravatar.cc/150?u=5"
  }
];
export const today = "2026-10-15";
export const tomorrow = "2026-10-16";
const yesterday = "2026-10-14";
const past1 = "2026-10-12";
const past2 = "2026-10-10";
const past3 = "2026-10-08";
const initialSessions = [
  {
    id: 1,
    clientName: "Nguy\u1EC5n V\u0103n An",
    phone: "0901 234 567",
    date: today,
    time: "06:30 - 07:30",
    focus: "Th\xE2n tr\xEAn - Ng\u1EF1c & Tay sau",
    sessionNumber: "Bu\u1ED5i 9/24",
    status: "S\u1EAFp t\u1EDBi",
    notes: [{ id: 1, time: "06:30", text: "T\u0103ng tr\u1ECDng l\u01B0\u1EE3ng bench press 5kg. Ch\xFA \xFD form \u0111\xF9i." }]
  },
  {
    id: 2,
    clientName: "Tr\u1EA7n Th\u1ECB B\xECnh",
    phone: "0912 345 678",
    date: today,
    time: "07:45 - 08:45",
    focus: "Ch\xE2n & M\xF4ng",
    sessionNumber: "Bu\u1ED5i 16/36",
    status: "C\u1EA7n nh\u1EAFc l\u1ECBch",
    notes: [{ id: 2, time: "07:45", text: "Kh\xE1ch ch\u01B0a x\xE1c nh\u1EADn. G\u1EEDi Zalo nh\u1EAFc 30 ph\xFAt tr\u01B0\u1EDBc." }]
  },
  {
    id: 3,
    clientName: "L\xEA V\u0103n C\u01B0\u1EDDng",
    phone: "0923 456 789",
    date: today,
    time: "18:00 - 19:00",
    focus: "Cardio & Core",
    sessionNumber: "Bu\u1ED5i 23/24",
    status: "S\u1EAFp t\u1EDBi",
    notes: [{ id: 3, time: "18:00", text: "Bu\u1ED5i g\u1EA7n cu\u1ED1i g\xF3i. Chu\u1EA9n b\u1ECB t\u01B0 v\u1EA5n gia h\u1EA1n." }]
  },
  {
    id: 4,
    clientName: "Ph\u1EA1m Th\u1ECB Dung",
    phone: "0934 567 890",
    date: tomorrow,
    time: "06:00 - 07:00",
    focus: "Full Body - HIIT",
    sessionNumber: "Bu\u1ED5i 4/12",
    status: "S\u1EAFp t\u1EDBi",
    notes: [{ id: 4, time: "06:00", text: "Quay l\u1EA1i sau ngh\u1EC9 2 tu\u1EA7n. C\u01B0\u1EDDng \u0111\u1ED9 nh\u1EB9, t\u1EADp form." }]
  },
  {
    id: 5,
    clientName: "Ho\xE0ng V\u0103n Em",
    phone: "0945 678 901",
    date: tomorrow,
    time: "17:30 - 18:30",
    focus: "Th\xE2n tr\xEAn - L\u01B0ng & Vai",
    sessionNumber: "Bu\u1ED5i 13/24",
    status: "S\u1EAFp t\u1EDBi",
    notes: [{ id: 5, time: "17:30", text: "Chu\u1EA9n b\u1ECB marathon 10km. Th\xEAm pull-up band assisted." }]
  },
  {
    id: 6,
    clientName: "V\u0169 Th\u1ECB Ph\u01B0\u1EE3ng",
    phone: "0956 789 012",
    date: tomorrow,
    time: "19:00 - 20:00",
    focus: "Ch\xE2n - Squat & Deadlift",
    sessionNumber: "Bu\u1ED5i 7/24",
    status: "C\u1EA7n nh\u1EAFc l\u1ECBch",
    notes: [{ id: 6, time: "19:00", text: "L\u1ECBch thay \u0111\u1ED5i t\u1EEB th\u1EE9 3. C\u1EA7n x\xE1c nh\u1EADn l\u1EA1i gi\u1EDD." }]
  },
  {
    id: 7,
    clientName: "\u0110\u1EB7ng V\u0103n Giang",
    phone: "0967 890 123",
    date: yesterday,
    time: "06:30 - 07:30",
    focus: "Ng\u1EF1c & Tay tr\u01B0\u1EDBc",
    sessionNumber: "Bu\u1ED5i 11/24",
    status: "\u0110\xE3 ho\xE0n th\xE0nh",
    notes: [{ id: 7, time: "06:30", text: "PR bench press 70kg x 5 reps. Form t\u1ED1t, t\u0103ng 2.5kg bu\u1ED5i sau." }]
  },
  {
    id: 8,
    clientName: "B\xF9i Th\u1ECB H\u1EA1nh",
    phone: "0978 901 234",
    date: yesterday,
    time: "18:00 - 19:00",
    focus: "M\xF4ng & H\u1EADu \u0111\xF9i",
    sessionNumber: "Bu\u1ED5i 5/12",
    status: "\u0110\xE3 ho\xE0n th\xE0nh",
    notes: [{ id: 8, time: "18:00", text: "Hip thrust 60kg x 10. Glute activation t\u1ED1t. Th\xEAm band work." }]
  },
  {
    id: 9,
    clientName: "Ng\xF4 V\u0103n Kh\u1EA3i",
    phone: "0989 012 345",
    date: past1,
    time: "07:00 - 08:00",
    focus: "Cardio - Interval Running",
    sessionNumber: "Bu\u1ED5i 18/36",
    status: "\u0110\xE3 ho\xE0n th\xE0nh",
    notes: [{ id: 9, time: "07:00", text: "8km pace 6:15/km. HR zone 3 duy tr\xEC t\u1ED1t. T\u0103ng 1km tu\u1EA7n sau." }]
  },
  {
    id: 10,
    clientName: "D\u01B0\u01A1ng Th\u1ECB Lan",
    phone: "0990 123 456",
    date: past2,
    time: "17:00 - 18:00",
    focus: "Th\xE2n d\u01B0\u1EDBi - Lunge & Step up",
    sessionNumber: "Bu\u1ED5i 3/24",
    status: "\u0110\xE3 d\u1EDDi l\u1ECBch",
    notes: [{ id: 10, time: "17:00", text: "Kh\xE1ch b\u1EADn \u0111\u1ED9t xu\u1EA5t. \u0110\xE3 d\u1EDDi sang 20/10 l\xFAc 17:00." }]
  },
  {
    id: 11,
    clientName: "Phan V\u0103n Minh",
    phone: "0901 111 222",
    date: past3,
    time: "06:00 - 07:00",
    focus: "Core & Mobility",
    sessionNumber: "Bu\u1ED5i 12/24",
    status: "\u0110\xE3 ho\xE0n th\xE0nh",
    notes: [{ id: 11, time: "06:00", text: "Plank 3 ph\xFAt. Bird-dog 3x12. C\u1EA3i thi\u1EC7n \u0111au l\u01B0ng d\u01B0\u1EDBi." }]
  },
  {
    id: 12,
    clientName: "V\xF5 Th\u1ECB Nga",
    phone: "0912 222 333",
    date: "2026-10-05",
    time: "18:30 - 19:30",
    focus: "Vai & Tay sau",
    sessionNumber: "Bu\u1ED5i 8/24",
    status: "\u0110\xE3 ho\xE0n th\xE0nh",
    notes: [{ id: 12, time: "18:30", text: "Overhead press 30kg x 8. Lateral raise drop set. Form \u1ED5n." }]
  }
];
const initialProgressClients = [
  {
    id: 1,
    name: "Nguy\u1EC5n V\u0103n An",
    phone: "0901 234 567",
    goal: "Gi\u1EA3m m\u1EE1",
    height: 172,
    inbodyRecords: [
      {
        id: 101,
        date: "20/10/2026",
        height: 172,
        weight: 74.2,
        inbodyScore: 76,
        smm: 32.4,
        bodyFatMass: 16.9,
        pbf: 22.8,
        tbw: 40.8,
        bmi: 25.1,
        bmr: 1605,
        visceralFat: 9,
        waist: 88,
        hip: 98,
        chest: 102,
        note: "Gi\u1EA3m t\u1ED1t, m\u1EE1 n\u1ED9i t\u1EA1ng xu\u1ED1ng 1 c\u1EA5p. Duy tr\xEC cardio 3 bu\u1ED5i/tu\u1EA7n v\xE0 si\u1EBFt carb bu\u1ED5i t\u1ED1i."
      },
      {
        id: 102,
        date: "05/10/2026",
        height: 172,
        weight: 75.6,
        inbodyScore: 73,
        smm: 32,
        bodyFatMass: 18.3,
        pbf: 24.2,
        tbw: 41,
        bmi: 25.6,
        bmr: 1600,
        visceralFat: 10,
        waist: 90,
        hip: 99,
        chest: 102,
        note: "C\u01A1 x\u01B0\u01A1ng t\u0103ng nh\u1EB9, m\u1EE1 gi\u1EA3m \u0111\u1EC1u. T\u0103ng th\xEAm 1 bu\u1ED5i HIIT m\u1ED7i tu\u1EA7n."
      },
      {
        id: 103,
        date: "20/09/2026",
        height: 172,
        weight: 76.8,
        inbodyScore: 70,
        smm: 31.6,
        bodyFatMass: 19.7,
        pbf: 25.6,
        tbw: 41.1,
        bmi: 26,
        bmr: 1592,
        visceralFat: 11,
        waist: 92,
        hip: 100,
        chest: 103,
        note: "B\u1EAFt \u0111\u1EA7u si\u1EBFt dinh d\u01B0\u1EE1ng, ng\u1EE7 ch\u01B0a \u0111\u1EE7 gi\u1EA5c n\xEAn c\u1EA7n nh\u1EAFc kh\xE1ch \u0111i ng\u1EE7 s\u1EDBm."
      },
      {
        id: 104,
        date: "05/09/2026",
        height: 172,
        weight: 78,
        inbodyScore: 67,
        smm: 31.2,
        bodyFatMass: 21.1,
        pbf: 27,
        tbw: 41.2,
        bmi: 26.4,
        bmr: 1585,
        visceralFat: 12,
        waist: 94,
        hip: 101,
        chest: 104,
        note: "\u0110o l\u1EA7n \u0111\u1EA7u khi b\u1EAFt \u0111\u1EA7u g\xF3i t\u1EADp. Th\u1EC3 tr\u1EA1ng trung b\xECnh, \u01B0u ti\xEAn gi\u1EA3m m\u1EE1."
      }
    ]
  },
  {
    id: 2,
    name: "Tr\u1EA7n Th\u1ECB B\xECnh",
    phone: "0912 345 678",
    goal: "T\u0103ng c\u01A1",
    height: 163,
    inbodyRecords: [
      {
        id: 201,
        date: "18/10/2026",
        height: 163,
        weight: 55.4,
        inbodyScore: 78,
        smm: 23.1,
        bodyFatMass: 13.3,
        pbf: 24,
        tbw: 30.5,
        bmi: 20.9,
        bmr: 1280,
        visceralFat: 6,
        waist: 68,
        hip: 94,
        chest: 86,
        note: "T\u0103ng 0.4kg c\u01A1 trong 2 tu\u1EA7n, r\u1EA5t t\u1ED1t. Gi\u1EEF protein 2g/kg c\xE2n n\u1EB7ng v\xE0 ng\u1EE7 7-8 ti\u1EBFng."
      },
      {
        id: 202,
        date: "02/10/2026",
        height: 163,
        weight: 55,
        inbodyScore: 76,
        smm: 22.7,
        bodyFatMass: 13.5,
        pbf: 24.6,
        tbw: 30.3,
        bmi: 20.7,
        bmr: 1265,
        visceralFat: 6,
        waist: 68,
        hip: 94,
        chest: 86,
        note: "S\u1EE9c m\u1EA1nh squat t\u0103ng, c\u01A1 m\xF4ng ph\xE1t tri\u1EC3n r\xF5. T\u0103ng t\u1EA1 th\xEAm 2.5kg m\u1ED7i tu\u1EA7n."
      },
      {
        id: 203,
        date: "15/09/2026",
        height: 163,
        weight: 54.2,
        inbodyScore: 74,
        smm: 22.2,
        bodyFatMass: 13.7,
        pbf: 25.3,
        tbw: 29.8,
        bmi: 20.4,
        bmr: 1248,
        visceralFat: 7,
        waist: 69,
        hip: 93,
        chest: 85,
        note: "\u0102n ch\u01B0a \u0111\u1EE7 b\u1EEFa s\xE1ng, c\u1EA7n b\u1ED5 sung th\xEAm tinh b\u1ED9t t\u1ED1t tr\u01B0\u1EDBc bu\u1ED5i t\u1EADp."
      },
      {
        id: 204,
        date: "01/09/2026",
        height: 163,
        weight: 53.6,
        inbodyScore: 72,
        smm: 21.8,
        bodyFatMass: 13.9,
        pbf: 26,
        tbw: 29.5,
        bmi: 20.2,
        bmr: 1230,
        visceralFat: 7,
        waist: 70,
        hip: 93,
        chest: 85,
        note: "\u0110o l\u1EA7n \u0111\u1EA7u. M\u1EE5c ti\xEAu t\u0103ng c\u01A1 n\u1EA1c, h\u1EA1n ch\u1EBF t\u0103ng m\u1EE1."
      }
    ]
  },
  {
    id: 3,
    name: "L\xEA V\u0103n C\u01B0\u1EDDng",
    phone: "0923 456 789",
    goal: "Duy tr\xEC form",
    height: 170,
    inbodyRecords: [
      {
        id: 301,
        date: "14/10/2026",
        height: 170,
        weight: 72,
        inbodyScore: 82,
        smm: 33.8,
        bodyFatMass: 11.7,
        pbf: 16.2,
        tbw: 42.5,
        bmi: 24.9,
        bmr: 1668,
        visceralFat: 6,
        waist: 82,
        hip: 96,
        chest: 104,
        note: "Ch\u1EC9 s\u1ED1 \u1ED5n \u0111\u1ECBnh, form gi\u1EEF t\u1ED1t. C\xF3 th\u1EC3 gi\u1EA3m 1 bu\u1ED5i cardio \u0111\u1EC3 d\xE0nh th\u1EDDi gian cho mobility."
      },
      {
        id: 302,
        date: "30/09/2026",
        height: 170,
        weight: 72.4,
        inbodyScore: 81,
        smm: 33.5,
        bodyFatMass: 12.2,
        pbf: 16.8,
        tbw: 42.4,
        bmi: 25.1,
        bmr: 1665,
        visceralFat: 6,
        waist: 82,
        hip: 96,
        chest: 104,
        note: "Duy tr\xEC t\u1ED1t. Ch\xFA \xFD gi\xE3n c\u01A1 h\xF4ng v\xEC kh\xE1ch l\xE0m vi\u1EC7c ng\u1ED3i nhi\u1EC1u."
      },
      {
        id: 303,
        date: "12/09/2026",
        height: 170,
        weight: 71.8,
        inbodyScore: 82,
        smm: 33.6,
        bodyFatMass: 11.5,
        pbf: 16,
        tbw: 42.6,
        bmi: 24.8,
        bmr: 1670,
        visceralFat: 6,
        waist: 81,
        hip: 96,
        chest: 104,
        note: "Ki\u1EC3m tra \u0111\u1ECBnh k\u1EF3. To\xE0n b\u1ED9 ch\u1EC9 s\u1ED1 trong ng\u01B0\u1EE1ng an to\xE0n."
      }
    ]
  },
  {
    id: 4,
    name: "Ph\u1EA1m Th\u1ECB Dung",
    phone: "0934 567 890",
    goal: "Gi\u1EA3m m\u1EE1",
    height: 158,
    inbodyRecords: [
      {
        id: 401,
        date: "10/10/2026",
        height: 158,
        weight: 63.5,
        inbodyScore: 68,
        smm: 22,
        bodyFatMass: 20.6,
        pbf: 32.5,
        tbw: 32.2,
        bmi: 25.4,
        bmr: 1295,
        visceralFat: 11,
        waist: 84,
        hip: 102,
        chest: 94,
        note: "T\u1EA1m d\u1EEBng 2 tu\u1EA7n n\xEAn m\u1EE1 t\u0103ng nh\u1EB9 tr\u1EDF l\u1EA1i. Khi quay l\u1EA1i s\u1EBD t\u1EADp nh\u1EB9, tr\xE1nh qu\xE1 t\u1EA3i."
      },
      {
        id: 402,
        date: "26/09/2026",
        height: 158,
        weight: 64.2,
        inbodyScore: 66,
        smm: 21.8,
        bodyFatMass: 21.3,
        pbf: 33.2,
        tbw: 32.4,
        bmi: 25.7,
        bmr: 1292,
        visceralFat: 11,
        waist: 85,
        hip: 103,
        chest: 95,
        note: "Gi\u1EA3m m\u1EE1 ch\u1EADm nh\u01B0ng \u0111\u1EC1u. \u0110i b\u1ED9 6000 b\u01B0\u1EDBc/ng\xE0y ngo\xE0i gi\u1EDD t\u1EADp."
      },
      {
        id: 403,
        date: "12/09/2026",
        height: 158,
        weight: 65,
        inbodyScore: 64,
        smm: 21.5,
        bodyFatMass: 22.1,
        pbf: 34,
        tbw: 32.6,
        bmi: 26,
        bmr: 1288,
        visceralFat: 12,
        waist: 87,
        hip: 104,
        chest: 95,
        note: "\u0110o l\u1EA7n \u0111\u1EA7u sau khi kh\xE1m s\u1EE9c kh\u1ECFe. \u01AFu ti\xEAn gi\u1EA3m m\u1EE1 n\u1ED9i t\u1EA1ng tr\u01B0\u1EDBc."
      }
    ]
  },
  {
    id: 5,
    name: "Ho\xE0ng V\u0103n Em",
    phone: "0945 678 901",
    goal: "T\u0103ng s\u1EE9c b\u1EC1n",
    height: 176,
    inbodyRecords: [
      {
        id: 501,
        date: "16/10/2026",
        height: 176,
        weight: 68.4,
        inbodyScore: 84,
        smm: 35.2,
        bodyFatMass: 12.3,
        pbf: 18,
        tbw: 42,
        bmi: 22.1,
        bmr: 1580,
        visceralFat: 5,
        waist: 78,
        hip: 94,
        chest: 98,
        note: "Chu\u1EA9n b\u1ECB marathon 10km. C\u01A1 x\u01B0\u01A1ng gi\u1EEF t\u1ED1t, m\u1EE1 gi\u1EA3m nh\u1EB9 \u0111\xFAng k\u1EBF ho\u1EA1ch."
      },
      {
        id: 502,
        date: "01/10/2026",
        height: 176,
        weight: 68.9,
        inbodyScore: 83,
        smm: 34.8,
        bodyFatMass: 12.8,
        pbf: 18.6,
        tbw: 42.1,
        bmi: 22.2,
        bmr: 1575,
        visceralFat: 5,
        waist: 79,
        hip: 94,
        chest: 98,
        note: "Long run 8km \u1ED5n. T\u0103ng carb tr\u01B0\u1EDBc c\xE1c bu\u1ED5i ch\u1EA1y d\xE0i."
      },
      {
        id: 503,
        date: "18/09/2026",
        height: 176,
        weight: 69.5,
        inbodyScore: 82,
        smm: 34.5,
        bodyFatMass: 13.3,
        pbf: 19.2,
        tbw: 42.3,
        bmi: 22.4,
        bmr: 1572,
        visceralFat: 6,
        waist: 79,
        hip: 95,
        chest: 98,
        note: "\u0110o l\u1EA7n \u0111\u1EA7u c\u1EE7a chu k\u1EF3 luy\u1EC7n marathon. N\u1EC1n t\u1EA3ng s\u1EE9c b\u1EC1n kh\xE1 t\u1ED1t."
      }
    ]
  }
];
const AppContext = createContext(null);
export function AppProvider({ children }) {
  const [clients, setClients] = useState(initialClients);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedInactiveClient, setSelectedInactiveClient] = useState(null);
  const [sessions, setSessions] = useState(initialSessions);
  const [selectedSession, setSelectedSession] = useState(null);
  const [progressClients, setProgressClients] = useState(initialProgressClients);
  const [selectedProgressClientId, setSelectedProgressClientId] = useState(initialProgressClients[0].id);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("pt_dark_mode") === "true"
  );
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("pt_dark_mode", String(isDarkMode));
  }, [isDarkMode]);
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };
  const addClient = (newClient) => {
    const clientToAdd = {
      ...newClient,
      id: Date.now(),
      completedSessions: 0,
      status: "\u0110ang t\u1EADp",
      lastInteractionDate: "2026-10-14",
      interactionLogs: [],
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    setClients([clientToAdd, ...clients]);
  };
  const updateClient = (id, updates) => {
    setClients(clients.map((c) => c.id === id ? { ...c, ...updates } : c));
    if (selectedClient && selectedClient.id === id) {
      setSelectedClient({ ...selectedClient, ...updates });
    }
  };
  const deleteClient = (id) => {
    setClients(clients.filter((c) => c.id !== id));
  };
  const addNote = (clientId, note) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    updateClient(clientId, {
      interactionLogs: [note, ...client.interactionLogs],
      lastInteractionDate: note.date
    });
  };
  const addSession = (newSession) => {
    const sessionToAdd = {
      ...newSession,
      id: Date.now(),
      sessionNumber: `Bu\u1ED5i ${newSession.sessionNumber}/24`
    };
    setSessions([sessionToAdd, ...sessions]);
  };
  const updateSession = (id, updates) => {
    setSessions(sessions.map((s) => s.id === id ? { ...s, ...updates } : s));
    if (selectedSession && selectedSession.id === id) {
      setSelectedSession({ ...selectedSession, ...updates });
    }
  };
  const deleteSession = (id) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };
  const addInbodyRecord = (record) => {
    setProgressClients(
      progressClients.map((c) => {
        if (c.id === selectedProgressClientId) {
          return { ...c, inbodyRecords: [record, ...c.inbodyRecords] };
        }
        return c;
      })
    );
  };
  const deleteInbodyRecord = (recordId) => {
    setProgressClients(
      progressClients.map((c) => {
        if (c.id === selectedProgressClientId) {
          return { ...c, inbodyRecords: c.inbodyRecords.filter((r) => r.id !== recordId) };
        }
        return c;
      })
    );
  };
  const value = {
    clients,
    selectedClient,
    setSelectedClient,
    addClient,
    updateClient,
    deleteClient,
    addNote,
    selectedInactiveClient,
    setSelectedInactiveClient,
    sessions,
    selectedSession,
    setSelectedSession,
    addSession,
    updateSession,
    deleteSession,
    progressClients,
    selectedProgressClientId,
    setSelectedProgressClientId,
    addInbodyRecord,
    deleteInbodyRecord,
    isDarkMode,
    toggleDarkMode
  };
  return /* @__PURE__ */ jsx(AppContext.Provider, { value, children });
}
export function useAppContext() {
  return useContext(AppContext);
}

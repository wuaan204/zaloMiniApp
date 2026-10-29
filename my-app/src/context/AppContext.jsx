import React, { createContext, useContext, useState } from "react";

// ============================================
// (1) DỮ LIỆU MẪU (mock data) dùng chung cho toàn app
// ============================================

// ----- Học viên -----
const initialClients = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    phone: "0901 234 567",
    goal: "Giảm mỡ",
    packageName: "Gói 24 buổi",
    completedSessions: 8,
    totalSessions: 24,
    status: "Đang tập",
    lastInteractionDate: "2026-10-12",
    notes: "Khách hàng muốn giảm cân trước Tết. Cần chú ý dinh dưỡng.",
    interactionLogs: [
      { date: "2026-10-12", content: "Tư vấn menu ăn kiêng giảm carb", nextAction: "Gửi file menu qua Zalo" },
      { date: "2026-10-05", content: "Buổi tập số 8 - HIIT 20 phút", nextAction: "Đặt lịch buổi 9 thứ 4 tới" },
      { date: "2026-09-28", content: "Đo InBody - giảm 1.5kg mỡ", nextAction: "Điều chỉnh bài tập tăng cường cardio" },
    ],
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    phone: "0912 345 678",
    goal: "Tăng cơ",
    packageName: "Gói 36 buổi",
    completedSessions: 15,
    totalSessions: 36,
    status: "Đang tập",
    lastInteractionDate: "2026-10-13",
    notes: "Đang tập phân chia upper/lower. Cần tăng trọng lượng từ từ.",
    interactionLogs: [
      { date: "2026-10-13", content: "Buổi tập số 15 - Leg day, PR squat 80kg", nextAction: "Tăng 5kg cho buổi tới" },
      { date: "2026-10-06", content: "Check form deadlift - cần sửa hunch back", nextAction: "Tập core thêm 3 bài" },
      { date: "2026-09-30", content: "Đo InBody - tăng 2kg cơ", nextAction: "Duy trì protein 2g/kg" },
    ],
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: 3,
    name: "Lê Văn Cường",
    phone: "0923 456 789",
    goal: "Duy trì form",
    packageName: "Gói 24 buổi",
    completedSessions: 22,
    totalSessions: 24,
    status: "Sắp hết gói",
    lastInteractionDate: "2026-10-06",
    notes: "Sắp hết gói 24 buổi. Cần tư vấn gia hạn hoặc nâng cấp.",
    interactionLogs: [
      { date: "2026-10-06", content: "Buổi tập số 22 - Full body maintenance", nextAction: "Nhắc gia hạn gói tập" },
      { date: "2026-09-29", content: "Buổi tập số 21 - Cardio + Core", nextAction: "Đặt lịch buổi cuối cùng" },
      { date: "2026-09-22", content: "Đo InBody - ổn định weight 72kg", nextAction: "Giữ nguyên chế độ" },
    ],
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: 4,
    name: "Phạm Thị Dung",
    phone: "0934 567 890",
    goal: "Giảm mỡ",
    packageName: "Gói 12 buổi",
    completedSessions: 3,
    totalSessions: 12,
    status: "Tạm dừng",
    lastInteractionDate: "2026-10-04",
    notes: "Tạm dừng do bận công việc. Hẹn quay lại sau 2 tuần.",
    interactionLogs: [
      { date: "2026-10-04", content: "Thông báo tạm dừng do deadline dự án", nextAction: "Liên hệ lại 20/10" },
      { date: "2026-09-27", content: "Buổi tập số 3 - HIIT beginner", nextAction: "Hướng dẫn bài tập tại nhà" },
      { date: "2026-09-20", content: "Khám sức khỏe - BT đều, cho phép tập nhẹ", nextAction: "Điều chỉnh cường độ thấp" },
    ],
    avatar: "https://i.pravatar.cc/150?u=4",
  },
  {
    id: 5,
    name: "Hoàng Văn Em",
    phone: "0945 678 901",
    goal: "Tăng sức bền",
    packageName: "Gói 24 buổi",
    completedSessions: 12,
    totalSessions: 24,
    status: "Đang tập",
    lastInteractionDate: "2026-10-07",
    notes: "Chuẩn bị chạy marathon 10km tháng 11. Tập cardio + strength.",
    interactionLogs: [
      { date: "2026-10-07", content: "Long run 8km - pace 6:30/km", nextAction: "Tăng lên 10km cuối tuần" },
      { date: "2026-09-30", content: "Buổi tập số 11 - Interval training", nextAction: "Theo dõi HR zone" },
      { date: "2026-09-23", content: "Đo InBody - body fat 18%", nextAction: "Duy trì carb loading trước chạy dài" },
    ],
    avatar: "https://i.pravatar.cc/150?u=5",
  },
];

// ----- Buổi tập (kèm các mốc ngày dùng để chia nhóm Hôm nay / Ngày mai / Ngày trước) -----
export const today = "2026-10-15";
export const tomorrow = "2026-10-16";
const yesterday = "2026-10-14";
const past1 = "2026-10-12";
const past2 = "2026-10-10";
const past3 = "2026-10-08";

const initialSessions = [
  {
    id: 1,
    clientName: "Nguyễn Văn An",
    phone: "0901 234 567",
    date: today,
    time: "06:30 - 07:30",
    focus: "Thân trên - Ngực & Tay sau",
    sessionNumber: "Buổi 9/24",
    status: "Sắp tới",
    notes: [{ id: 1, time: "06:30", text: "Tăng trọng lượng bench press 5kg. Chú ý form đùi." }],
  },
  {
    id: 2,
    clientName: "Trần Thị Bình",
    phone: "0912 345 678",
    date: today,
    time: "07:45 - 08:45",
    focus: "Chân & Mông",
    sessionNumber: "Buổi 16/36",
    status: "Cần nhắc lịch",
    notes: [{ id: 2, time: "07:45", text: "Khách chưa xác nhận. Gửi Zalo nhắc 30 phút trước." }],
  },
  {
    id: 3,
    clientName: "Lê Văn Cường",
    phone: "0923 456 789",
    date: today,
    time: "18:00 - 19:00",
    focus: "Cardio & Core",
    sessionNumber: "Buổi 23/24",
    status: "Sắp tới",
    notes: [{ id: 3, time: "18:00", text: "Buổi gần cuối gói. Chuẩn bị tư vấn gia hạn." }],
  },
  {
    id: 4,
    clientName: "Phạm Thị Dung",
    phone: "0934 567 890",
    date: tomorrow,
    time: "06:00 - 07:00",
    focus: "Full Body - HIIT",
    sessionNumber: "Buổi 4/12",
    status: "Sắp tới",
    notes: [{ id: 4, time: "06:00", text: "Quay lại sau nghỉ 2 tuần. Cường độ nhẹ, tập form." }],
  },
  {
    id: 5,
    clientName: "Hoàng Văn Em",
    phone: "0945 678 901",
    date: tomorrow,
    time: "17:30 - 18:30",
    focus: "Thân trên - Lưng & Vai",
    sessionNumber: "Buổi 13/24",
    status: "Sắp tới",
    notes: [{ id: 5, time: "17:30", text: "Chuẩn bị marathon 10km. Thêm pull-up band assisted." }],
  },
  {
    id: 6,
    clientName: "Vũ Thị Phượng",
    phone: "0956 789 012",
    date: tomorrow,
    time: "19:00 - 20:00",
    focus: "Chân - Squat & Deadlift",
    sessionNumber: "Buổi 7/24",
    status: "Cần nhắc lịch",
    notes: [{ id: 6, time: "19:00", text: "Lịch thay đổi từ thứ 3. Cần xác nhận lại giờ." }],
  },
  {
    id: 7,
    clientName: "Đặng Văn Giang",
    phone: "0967 890 123",
    date: yesterday,
    time: "06:30 - 07:30",
    focus: "Ngực & Tay trước",
    sessionNumber: "Buổi 11/24",
    status: "Đã hoàn thành",
    notes: [{ id: 7, time: "06:30", text: "PR bench press 70kg x 5 reps. Form tốt, tăng 2.5kg buổi sau." }],
  },
  {
    id: 8,
    clientName: "Bùi Thị Hạnh",
    phone: "0978 901 234",
    date: yesterday,
    time: "18:00 - 19:00",
    focus: "Mông & Hậu đùi",
    sessionNumber: "Buổi 5/12",
    status: "Đã hoàn thành",
    notes: [{ id: 8, time: "18:00", text: "Hip thrust 60kg x 10. Glute activation tốt. Thêm band work." }],
  },
  {
    id: 9,
    clientName: "Ngô Văn Khải",
    phone: "0989 012 345",
    date: past1,
    time: "07:00 - 08:00",
    focus: "Cardio - Interval Running",
    sessionNumber: "Buổi 18/36",
    status: "Đã hoàn thành",
    notes: [{ id: 9, time: "07:00", text: "8km pace 6:15/km. HR zone 3 duy trì tốt. Tăng 1km tuần sau." }],
  },
  {
    id: 10,
    clientName: "Dương Thị Lan",
    phone: "0990 123 456",
    date: past2,
    time: "17:00 - 18:00",
    focus: "Thân dưới - Lunge & Step up",
    sessionNumber: "Buổi 3/24",
    status: "Đã dời lịch",
    notes: [{ id: 10, time: "17:00", text: "Khách bận đột xuất. Đã dời sang 20/10 lúc 17:00." }],
  },
  {
    id: 11,
    clientName: "Phan Văn Minh",
    phone: "0901 111 222",
    date: past3,
    time: "06:00 - 07:00",
    focus: "Core & Mobility",
    sessionNumber: "Buổi 12/24",
    status: "Đã hoàn thành",
    notes: [{ id: 11, time: "06:00", text: "Plank 3 phút. Bird-dog 3x12. Cải thiện đau lưng dưới." }],
  },
  {
    id: 12,
    clientName: "Võ Thị Nga",
    phone: "0912 222 333",
    date: "2026-10-05",
    time: "18:30 - 19:30",
    focus: "Vai & Tay sau",
    sessionNumber: "Buổi 8/24",
    status: "Đã hoàn thành",
    notes: [{ id: 12, time: "18:30", text: "Overhead press 30kg x 8. Lateral raise drop set. Form ổn." }],
  },
];

// ----- Học viên kèm các bản ghi InBody (mới nhất -> cũ nhất) -----
const initialProgressClients = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    phone: "0901 234 567",
    goal: "Giảm mỡ",
    height: 172,
    inbodyRecords: [
      {
        id: 101, date: "20/10/2026", height: 172, weight: 74.2, inbodyScore: 76,
        smm: 32.4, bodyFatMass: 16.9, pbf: 22.8, tbw: 40.8,
        bmi: 25.1, bmr: 1605, visceralFat: 9,
        waist: 88, hip: 98, chest: 102,
        note: "Giảm tốt, mỡ nội tạng xuống 1 cấp. Duy trì cardio 3 buổi/tuần và siết carb buổi tối.",
      },
      {
        id: 102, date: "05/10/2026", height: 172, weight: 75.6, inbodyScore: 73,
        smm: 32.0, bodyFatMass: 18.3, pbf: 24.2, tbw: 41.0,
        bmi: 25.6, bmr: 1600, visceralFat: 10,
        waist: 90, hip: 99, chest: 102,
        note: "Cơ xương tăng nhẹ, mỡ giảm đều. Tăng thêm 1 buổi HIIT mỗi tuần.",
      },
      {
        id: 103, date: "20/09/2026", height: 172, weight: 76.8, inbodyScore: 70,
        smm: 31.6, bodyFatMass: 19.7, pbf: 25.6, tbw: 41.1,
        bmi: 26.0, bmr: 1592, visceralFat: 11,
        waist: 92, hip: 100, chest: 103,
        note: "Bắt đầu siết dinh dưỡng, ngủ chưa đủ giấc nên cần nhắc khách đi ngủ sớm.",
      },
      {
        id: 104, date: "05/09/2026", height: 172, weight: 78.0, inbodyScore: 67,
        smm: 31.2, bodyFatMass: 21.1, pbf: 27.0, tbw: 41.2,
        bmi: 26.4, bmr: 1585, visceralFat: 12,
        waist: 94, hip: 101, chest: 104,
        note: "Đo lần đầu khi bắt đầu gói tập. Thể trạng trung bình, ưu tiên giảm mỡ.",
      },
    ],
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    phone: "0912 345 678",
    goal: "Tăng cơ",
    height: 163,
    inbodyRecords: [
      {
        id: 201, date: "18/10/2026", height: 163, weight: 55.4, inbodyScore: 78,
        smm: 23.1, bodyFatMass: 13.3, pbf: 24.0, tbw: 30.5,
        bmi: 20.9, bmr: 1280, visceralFat: 6,
        waist: 68, hip: 94, chest: 86,
        note: "Tăng 0.4kg cơ trong 2 tuần, rất tốt. Giữ protein 2g/kg cân nặng và ngủ 7-8 tiếng.",
      },
      {
        id: 202, date: "02/10/2026", height: 163, weight: 55.0, inbodyScore: 76,
        smm: 22.7, bodyFatMass: 13.5, pbf: 24.6, tbw: 30.3,
        bmi: 20.7, bmr: 1265, visceralFat: 6,
        waist: 68, hip: 94, chest: 86,
        note: "Sức mạnh squat tăng, cơ mông phát triển rõ. Tăng tạ thêm 2.5kg mỗi tuần.",
      },
      {
        id: 203, date: "15/09/2026", height: 163, weight: 54.2, inbodyScore: 74,
        smm: 22.2, bodyFatMass: 13.7, pbf: 25.3, tbw: 29.8,
        bmi: 20.4, bmr: 1248, visceralFat: 7,
        waist: 69, hip: 93, chest: 85,
        note: "Ăn chưa đủ bữa sáng, cần bổ sung thêm tinh bột tốt trước buổi tập.",
      },
      {
        id: 204, date: "01/09/2026", height: 163, weight: 53.6, inbodyScore: 72,
        smm: 21.8, bodyFatMass: 13.9, pbf: 26.0, tbw: 29.5,
        bmi: 20.2, bmr: 1230, visceralFat: 7,
        waist: 70, hip: 93, chest: 85,
        note: "Đo lần đầu. Mục tiêu tăng cơ nạc, hạn chế tăng mỡ.",
      },
    ],
  },
  {
    id: 3,
    name: "Lê Văn Cường",
    phone: "0923 456 789",
    goal: "Duy trì form",
    height: 170,
    inbodyRecords: [
      {
        id: 301, date: "14/10/2026", height: 170, weight: 72.0, inbodyScore: 82,
        smm: 33.8, bodyFatMass: 11.7, pbf: 16.2, tbw: 42.5,
        bmi: 24.9, bmr: 1668, visceralFat: 6,
        waist: 82, hip: 96, chest: 104,
        note: "Chỉ số ổn định, form giữ tốt. Có thể giảm 1 buổi cardio để dành thời gian cho mobility.",
      },
      {
        id: 302, date: "30/09/2026", height: 170, weight: 72.4, inbodyScore: 81,
        smm: 33.5, bodyFatMass: 12.2, pbf: 16.8, tbw: 42.4,
        bmi: 25.1, bmr: 1665, visceralFat: 6,
        waist: 82, hip: 96, chest: 104,
        note: "Duy trì tốt. Chú ý giãn cơ hông vì khách làm việc ngồi nhiều.",
      },
      {
        id: 303, date: "12/09/2026", height: 170, weight: 71.8, inbodyScore: 82,
        smm: 33.6, bodyFatMass: 11.5, pbf: 16.0, tbw: 42.6,
        bmi: 24.8, bmr: 1670, visceralFat: 6,
        waist: 81, hip: 96, chest: 104,
        note: "Kiểm tra định kỳ. Toàn bộ chỉ số trong ngưỡng an toàn.",
      },
    ],
  },
  {
    id: 4,
    name: "Phạm Thị Dung",
    phone: "0934 567 890",
    goal: "Giảm mỡ",
    height: 158,
    inbodyRecords: [
      {
        id: 401, date: "10/10/2026", height: 158, weight: 63.5, inbodyScore: 68,
        smm: 22.0, bodyFatMass: 20.6, pbf: 32.5, tbw: 32.2,
        bmi: 25.4, bmr: 1295, visceralFat: 11,
        waist: 84, hip: 102, chest: 94,
        note: "Tạm dừng 2 tuần nên mỡ tăng nhẹ trở lại. Khi quay lại sẽ tập nhẹ, tránh quá tải.",
      },
      {
        id: 402, date: "26/09/2026", height: 158, weight: 64.2, inbodyScore: 66,
        smm: 21.8, bodyFatMass: 21.3, pbf: 33.2, tbw: 32.4,
        bmi: 25.7, bmr: 1292, visceralFat: 11,
        waist: 85, hip: 103, chest: 95,
        note: "Giảm mỡ chậm nhưng đều. Đi bộ 6000 bước/ngày ngoài giờ tập.",
      },
      {
        id: 403, date: "12/09/2026", height: 158, weight: 65.0, inbodyScore: 64,
        smm: 21.5, bodyFatMass: 22.1, pbf: 34.0, tbw: 32.6,
        bmi: 26.0, bmr: 1288, visceralFat: 12,
        waist: 87, hip: 104, chest: 95,
        note: "Đo lần đầu sau khi khám sức khỏe. Ưu tiên giảm mỡ nội tạng trước.",
      },
    ],
  },
  {
    id: 5,
    name: "Hoàng Văn Em",
    phone: "0945 678 901",
    goal: "Tăng sức bền",
    height: 176,
    inbodyRecords: [
      {
        id: 501, date: "16/10/2026", height: 176, weight: 68.4, inbodyScore: 84,
        smm: 35.2, bodyFatMass: 12.3, pbf: 18.0, tbw: 42.0,
        bmi: 22.1, bmr: 1580, visceralFat: 5,
        waist: 78, hip: 94, chest: 98,
        note: "Chuẩn bị marathon 10km. Cơ xương giữ tốt, mỡ giảm nhẹ đúng kế hoạch.",
      },
      {
        id: 502, date: "01/10/2026", height: 176, weight: 68.9, inbodyScore: 83,
        smm: 34.8, bodyFatMass: 12.8, pbf: 18.6, tbw: 42.1,
        bmi: 22.2, bmr: 1575, visceralFat: 5,
        waist: 79, hip: 94, chest: 98,
        note: "Long run 8km ổn. Tăng carb trước các buổi chạy dài.",
      },
      {
        id: 503, date: "18/09/2026", height: 176, weight: 69.5, inbodyScore: 82,
        smm: 34.5, bodyFatMass: 13.3, pbf: 19.2, tbw: 42.3,
        bmi: 22.4, bmr: 1572, visceralFat: 6,
        waist: 79, hip: 95, chest: 98,
        note: "Đo lần đầu của chu kỳ luyện marathon. Nền tảng sức bền khá tốt.",
      },
    ],
  },
];

// ============================================
// (2) CONTEXT: state dùng chung giữa các trang (route)
// ============================================
const AppContext = createContext(null);

// Component bọc toàn app: giữ state và các hàm xử lý để mọi trang cùng dùng
export function AppProvider({ children }) {
  // Danh sách học viên và học viên đang được chọn xem chi tiết
  const [clients, setClients] = useState(initialClients);
  const [selectedClient, setSelectedClient] = useState(null);

  // Học viên "cần theo dõi" ở Dashboard đang được chọn xem chi tiết
  const [selectedInactiveClient, setSelectedInactiveClient] = useState(null);

  // Danh sách buổi tập và buổi tập đang được chọn xem chi tiết
  const [sessions, setSessions] = useState(initialSessions);
  const [selectedSession, setSelectedSession] = useState(null);

  // Học viên kèm bản ghi InBody và id học viên đang xem ở trang Tiến độ
  const [progressClients, setProgressClients] = useState(initialProgressClients);
  const [selectedProgressClientId, setSelectedProgressClientId] = useState(initialProgressClients[0].id);

  // ----- (3) HANDLERS: học viên -----

  // Thêm học viên mới vào đầu danh sách
  const addClient = (newClient) => {
    const clientToAdd = {
      ...newClient,
      id: Date.now(),
      completedSessions: 0,
      status: "Đang tập",
      lastInteractionDate: "2026-10-14",
      interactionLogs: [],
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
    };
    setClients([clientToAdd, ...clients]);
  };

  // Cập nhật 1 học viên (cả trong danh sách lẫn học viên đang được chọn)
  const updateClient = (id, updates) => {
    setClients(clients.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    if (selectedClient && selectedClient.id === id) {
      setSelectedClient({ ...selectedClient, ...updates });
    }
  };

  // Xóa 1 học viên khỏi danh sách
  const deleteClient = (id) => {
    setClients(clients.filter((c) => c.id !== id));
  };

  // Thêm ghi chú tương tác mới vào đầu lịch sử của học viên
  const addNote = (clientId, note) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    updateClient(clientId, {
      interactionLogs: [note, ...client.interactionLogs],
      lastInteractionDate: note.date,
    });
  };

  // ----- HANDLERS: buổi tập -----

  // Thêm buổi tập mới vào đầu danh sách
  const addSession = (newSession) => {
    const sessionToAdd = {
      ...newSession,
      id: Date.now(),
      sessionNumber: `Buổi ${newSession.sessionNumber}/24`,
    };
    setSessions([sessionToAdd, ...sessions]);
  };

  // Cập nhật 1 buổi tập (cả trong danh sách lẫn buổi tập đang được chọn)
  const updateSession = (id, updates) => {
    setSessions(sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    if (selectedSession && selectedSession.id === id) {
      setSelectedSession({ ...selectedSession, ...updates });
    }
  };

  // Xóa 1 buổi tập khỏi danh sách
  const deleteSession = (id) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  // ----- HANDLERS: bản ghi InBody (luôn thao tác trên học viên đang chọn ở trang Tiến độ) -----

  // Thêm bản ghi InBody mới vào đầu danh sách của học viên đang chọn
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

  // Xóa 1 bản ghi InBody của học viên đang chọn
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

  // Gom toàn bộ state + handler vào một object để chia sẻ qua Context
  const value = {
    clients, selectedClient, setSelectedClient, addClient, updateClient, deleteClient, addNote,
    selectedInactiveClient, setSelectedInactiveClient,
    sessions, selectedSession, setSelectedSession, addSession, updateSession, deleteSession,
    progressClients, selectedProgressClientId, setSelectedProgressClientId, addInbodyRecord, deleteInbodyRecord,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook ngắn gọn để các trang lấy state dùng chung
export function useAppContext() {
  return useContext(AppContext);
}
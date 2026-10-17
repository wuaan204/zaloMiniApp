import { Page, Text, Box, Button, Icon, Modal, Avatar, Input, Select, useNavigate } from "zmp-ui";
import React, { useState, useMemo, useEffect } from "react";

// ============================================
// MOCK DATA - 5 Clients with realistic data
// ============================================
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

// Helpers
function getDaysSince(dateStr) {
  const today = new Date("2026-10-14");
  const lastDate = new Date(dateStr);
  return Math.ceil((today - lastDate) / (1000 * 60 * 60 * 24));
}
function getStatusBadge(status) {
  switch (status) {
    case "Đang tập": return { variant: "success", text: "Đang tập" };
    case "Tạm dừng": return { variant: "warning", text: "Tạm dừng" };
    case "Sắp hết gói": return { variant: "danger", text: "Sắp hết gói" };
    default: return { variant: "default", text: status };
  }
}
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}
function pillClasses(type, daysSince) {
  // type: 'goal' | 'package' | 'contact'
  if (type === 'goal') return "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
  if (type === 'package') return "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800";
  // contact
  if (daysSince >= 7) return "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
  return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
}

// ============================================
// Client Card Component
// ============================================
function ClientCard({ client, onClick }) {
  const daysSince = getDaysSince(client.lastInteractionDate);
  const progress = Math.round((client.completedSessions / client.totalSessions) * 100);
  const statusInfo = getStatusBadge(client.status);
  const isInactive = daysSince >= 7;

  return (
    <div
      className="bg-white rounded-xl border border-slate-300 shadow-sm p-4 cursor-pointer hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors"
      onClick={() => onClick(client)}
    >
      <div className="flex items-start gap-3">
        <Avatar size="large" src={client.avatar} alt={client.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <Text.Title size="medium" className="font-semibold text-gray-900 dark:text-white truncate">{client.name}</Text.Title>
              <Text className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</Text>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
              statusInfo.variant === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              statusInfo.variant === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              statusInfo.variant === 'danger' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {statusInfo.text}
            </span>
          </div>

          {/* Pills row */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${pillClasses('goal')}`}>
              {client.goal}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${pillClasses('package')}`}>
              {client.packageName}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${pillClasses('contact', daysSince)}`}>
              {isInactive ? `Cần theo dõi • ${daysSince} ngày` : `Liên hệ ${daysSince} ngày trước`}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <Text className="text-gray-500 dark:text-gray-400">Tiến độ</Text>
              <Text className="font-medium text-gray-900 dark:text-white">{client.completedSessions}/{client.totalSessions} buổi</Text>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Add Client Modal (unchanged)
// ============================================
function AddClientModal({ visible, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "", phone: "", goal: "Giảm mỡ", packageName: "Gói 24 buổi", totalSessions: 24, notes: "",
  });
  const goals = ["Giảm mỡ","Tăng cơ","Duy trì form","Tăng sức bền","Phục hồi chức năng"];
  const packages = ["Gói 12 buổi","Gói 24 buổi","Gói 36 buổi","Gói 48 buổi"];
  useEffect(() => { if (visible) setFormData({ name:"", phone:"", goal:"Giảm mỡ", packageName:"Gói 24 buổi", totalSessions:24, notes:"" }); }, [visible]);
  const handleSubmit = (e) => { e.preventDefault(); if(!formData.name.trim()||!formData.phone.trim()) return; onSubmit({...formData}); onClose(); };
  return (
    <Modal visible={visible} onClose={onClose} title="Thêm học viên mới" width="95%">
      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Họ tên <span className="text-red-500">*</span></Text>
          <Input value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} placeholder="Nguyễn Văn A" className="w-full" /></div>
        <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Số điện thoại <span className="text-red-500">*</span></Text>
          <Input type="tel" value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})} placeholder="0901 234 567" className="w-full" /></div>
        <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Mục tiêu tập</Text>
          <Select value={formData.goal} onChange={e=>setFormData({...formData,goal:e.target.value})} className="w-full">{goals.map(g=><option key={g} value={g}>{g}</option>)}</Select></div>
        <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Gói tập</Text>
          <Select value={formData.packageName} onChange={e=>setFormData({...formData,packageName:e.target.value})} className="w-full">{packages.map(p=><option key={p} value={p}>{p}</option>)}</Select></div>
        <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Tổng số buổi</Text>
          <Input type="number" value={formData.totalSessions} onChange={e=>setFormData({...formData,totalSessions:parseInt(e.target.value)||0})} min="1" className="w-full" /></div>
        <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Ghi chú</Text>
          <textarea value={formData.notes} onChange={e=>setFormData({...formData,notes:e.target.value})} rows={3} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Ghi chú thêm về học viên..." /></div>
        <div className="flex justify-end gap-2 pt-2"><Button variant="outline" type="button" onClick={onClose}>Hủy</Button><Button variant="primary" type="submit">Thêm học viên</Button></div>
      </form>
    </Modal>
  );
}

// ============================================
// Client Detail View (full-page, no Modal)
// ============================================
function ClientDetailView({ client, onClose, onUpdateClient }) {
  const [newInteraction, setNewInteraction] = useState({ content: "", nextAction: "" });
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(client?.completedSessions || 0);
  useEffect(() => { if (client) setCompletedSessions(client.completedSessions); }, [client]);

  const handleAddInteraction = (e) => {
    e.preventDefault(); if (!newInteraction.content.trim()) return;
    const today = "2026-10-14";
    const newLog = { date: today, content: newInteraction.content, nextAction: newInteraction.nextAction || "Chưa có kế hoạch tiếp theo" };
    onUpdateClient(client.id, { interactionLogs: [newLog, ...client.interactionLogs], lastInteractionDate: today, completedSessions });
    setNewInteraction({ content: "", nextAction: "" }); setShowAddInteraction(false);
  };
  const handleAddSession = () => { const next = Math.min(completedSessions+1, client.totalSessions); setCompletedSessions(next); onUpdateClient(client.id,{completedSessions:next}); };
  if (!client) return null;
  const daysSince = getDaysSince(client.lastInteractionDate);
  const progress = Math.round((client.completedSessions / client.totalSessions) * 100);
  const statusInfo = getStatusBadge(client.status);

  return (
    <div className="p-4 pb-28 space-y-4">
      {/* Header inside page — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
      <div
        className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-slate-100 dark:bg-slate-900 z-30 px-0 pr-24"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 44px), 44px)' }}
      >
        <Button variant="text" size="small" icon={<Icon icon="zi-chevron-left" size="18" />} onClick={onClose} className="flex-shrink-0">Quay lại</Button>
        <Avatar size="xlarge" src={client.avatar} alt={client.name} />
        <div className="flex-1 min-w-0">
          <Text.Title size="large" className="font-bold text-gray-900 dark:text-white truncate">{client.name}</Text.Title>
          <Text className="text-gray-500 dark:text-gray-400">{client.phone}</Text>
        </div>
        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
          statusInfo.variant==='success'?'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400':
          statusInfo.variant==='warning'?'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400':
          statusInfo.variant==='danger'?'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400':
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
          {statusInfo.text}
        </span>
      </div>

      {/* Summary boxes — strict 3-column grid, never wraps */}
      <div className="grid grid-cols-3 gap-2 w-full mt-3">
        <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${pillClasses('goal')} border`}>
          <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">Mục tiêu</span>
          <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{client.goal}</span>
        </div>
        <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${pillClasses('package')} border`}>
          <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">Gói tập</span>
          <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{client.packageName}</span>
        </div>
        <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${pillClasses('contact', daysSince)} border`}>
          <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">Liên hệ</span>
          <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{daysSince} ngày trước</span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <Text className="font-medium text-gray-900 dark:text-white">Tiến độ buổi tập</Text>
          <div className="flex items-center gap-2">
            <Text className="font-semibold text-gray-900 dark:text-white">{client.completedSessions}/{client.totalSessions}</Text>
            <Button size="small" variant="primary" className="w-8 h-8 p-0 flex items-center justify-center rounded-full" onClick={handleAddSession} disabled={client.completedSessions>=client.totalSessions}>
              <span className="text-white text-xl font-bold leading-none">+</span>
            </Button>
          </div>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{width:`${progress}%`}} />
        </div>
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">{progress}% hoàn thành</Text>
      </div>

      {/* Notes */}
      {client.notes && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center gap-1 mb-1"><Icon icon="zi-note" size="14" className="text-blue-600" /><Text className="text-sm font-medium text-blue-800 dark:text-blue-300">Ghi chú chung</Text></div>
          <Text className="text-sm text-blue-700 dark:text-blue-400">{client.notes}</Text>
        </div>
      )}

      {/* Interaction Logs */}
      <div className="flex items-center justify-between">
        <Text.Title size="medium" className="font-bold text-gray-900 dark:text-white">Nhật ký tương tác</Text.Title>
        <Button size="small" variant="primary" className="w-8 h-8 p-0 flex items-center justify-center rounded-full" onClick={()=>setShowAddInteraction(!showAddInteraction)}>
          <span className="text-white text-xl font-bold leading-none">{showAddInteraction?'×':'+'}</span>
        </Button>
      </div>

      {showAddInteraction && (
        <form onSubmit={handleAddInteraction} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
          <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Nội dung trao đổi <span className="text-red-500">*</span></Text>
            <textarea value={newInteraction.content} onChange={e=>setNewInteraction({...newInteraction,content:e.target.value})} rows={3} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Ví dụ: Đã trao đổi về menu ăn, khách hàng phản hồi khỏe..." required /></div>
          <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Việc cần làm tiếp theo</Text>
            <textarea value={newInteraction.nextAction} onChange={e=>setNewInteraction({...newInteraction,nextAction:e.target.value})} rows={2} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Ví dụ: Gửi file menu qua Zalo, đặt lịch buổi tới..." /></div>
          <div className="flex justify-end gap-2"><Button variant="outline" type="button" onClick={()=>setShowAddInteraction(false)}>Hủy</Button><Button variant="primary" type="submit">Lưu ghi chú</Button></div>
        </form>
      )}

      <div className="space-y-3">
        {client.interactionLogs.length===0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400"><Icon icon="zi-inbox" size="32" className="mx-auto mb-2" /><Text>Chưa có ghi chú tương tác</Text></div>
        ) : (
          client.interactionLogs.map((log,i)=>(
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium">{formatDate(log.date)}</Text>
                <Text className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">Tương tác</Text>
              </div>
              <Text className="text-sm text-gray-900 dark:text-white mb-2">{log.content}</Text>
              {log.nextAction && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2">
                  <div className="flex items-center gap-1 text-xs text-yellow-800 dark:text-yellow-300 mb-1"><Icon icon="zi-flag" size="12" /><Text className="font-medium">Việc cần làm:</Text></div>
                  <Text className="text-sm text-yellow-700 dark:text-yellow-400">{log.nextAction}</Text>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================
// Main Clients Page Component
// ============================================
export default function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Filter logic
  const filteredClients = useMemo(() => {
    let result = [...clients];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c=>c.name.toLowerCase().includes(q)||c.phone.replace(/\s/g,"").includes(q.replace(/\s/g,"")));
    }
    switch(activeFilter){
      case "active": result=result.filter(c=>c.status==="Đang tập"); break;
      case "inactive": result=result.filter(c=>getDaysSince(c.lastInteractionDate)>=7); break;
      case "expiring": result=result.filter(c=>c.status==="Sắp hết gói"); break;
    }
    return result;
  },[clients,searchQuery,activeFilter]);

  const filterCounts = useMemo(()=>({
    all:clients.length,
    active:clients.filter(c=>c.status==="Đang tập").length,
    inactive:clients.filter(c=>getDaysSince(c.lastInteractionDate)>=7).length,
    expiring:clients.filter(c=>c.status==="Sắp hết gói").length,
  }),[clients]);

  const handleAddClient = (nc)=>{ const today="2026-10-14"; setClients(p=>[{...nc,id:Date.now(),completedSessions:0,status:"Đang tập",lastInteractionDate:today,interactionLogs:[],avatar:`https://i.pravatar.cc/150?u=${Date.now()}`},...p]); };
  const handleUpdateClient = (id,up)=>{ setClients(p=>p.map(c=>c.id===id?{...c,...up}:c)); if(selectedClient?.id===id) setSelectedClient(prev=>prev?{...prev,...up}:null); };
  const handleClientClick = (c)=>setSelectedClient(c);

  const filters = [
    {key:"all",label:"Tất cả",count:filterCounts.all},
    {key:"active",label:"Đang tập",count:filterCounts.active},
    {key:"inactive",label:"Cần theo dõi",count:filterCounts.inactive},
    {key:"expiring",label:"Sắp hết gói",count:filterCounts.expiring},
  ];

  // Render Detail View when a client is selected
  if (selectedClient) {
    return (
      <Page className="bg-slate-100 dark:bg-slate-900 min-h-screen">
        <ClientDetailView client={selectedClient} onClose={()=>setSelectedClient(null)} onUpdateClient={handleUpdateClient} />
        <AddClientModal visible={showAddModal} onClose={()=>setShowAddModal(false)} onSubmit={handleAddClient} />
      </Page>
    );
  }

  // List View
  return (
    <Page className="bg-slate-100 dark:bg-slate-900 min-h-screen">
      {/* Header — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
      <div
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 pb-3 sticky top-0 z-30 pr-24"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 44px), 44px)' }}
      >
        <div className="flex items-center gap-2">
          <Button variant="text" size="small" icon={<Icon icon="zi-chevron-left" size="18" />} onClick={()=>navigate('/')}>Quay lại</Button>
          <div className="flex-1 min-w-0">
            <Text.Title size="xLarge" className="font-bold text-gray-900 dark:text-white">Học viên</Text.Title>
            <Text className="text-sm text-gray-500 dark:text-gray-400">Quản lý học viên</Text>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 pb-28 space-y-3">
        {/* Search Input */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Icon icon="zi-search" size="18" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="search" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Tìm theo tên hoặc SĐT..." className="w-full pl-9 pr-4 h-9 text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <Button variant="primary" size="small" icon={<Icon icon="zi-plus" size="18" />} onClick={()=>setShowAddModal(true)}>
            + Thêm HV
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map(f=>(
            <Button key={f.key} variant={activeFilter===f.key?"primary":"outline"} size="small" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0" onClick={()=>setActiveFilter(f.key)}>
              {f.label}
              <span className="ml-1 min-w-[18px] px-1.5 py-0.5 text-[10px] rounded-full bg-white/30 dark:bg-white/10 text-center font-bold">{f.count}</span>
            </Button>
          ))}
        </div>

        {/* Client List */}
        <div className="flex flex-col space-y-4 px-4">
          {filteredClients.length>0 ? (
            filteredClients.map(c=><ClientCard key={c.id} client={c} onClick={handleClientClick} />)
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center dark:bg-slate-800 dark:border dark:border-slate-700">
              <Icon icon="zi-user-search" size="48" className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <Text.Title size="medium" className="font-bold text-gray-900 dark:text-white mb-1">Không tìm thấy học viên</Text.Title>
              <Text className="text-gray-500 dark:text-gray-400">{searchQuery?"Thử từ khóa khác hoặc xóa bộ lọc":"Chưa có học viên nào. Hãy thêm học viên đầu tiên!"}</Text>
            </div>
          )}
        </div>
      </div>

      <AddClientModal visible={showAddModal} onClose={()=>setShowAddModal(false)} onSubmit={handleAddClient} />
    </Page>
  );
}
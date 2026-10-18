import { Page, Text, Box, Avatar, Button, Icon, useNavigate } from "zmp-ui";
import React, { useState } from "react";

// Mock data for dashboard stats
const stats = [
  { label: "Tổng học viên", value: "42", icon: "zi-user-group", color: "text-blue-600", bg: "bg-blue-50", abbrev: "HV" },
  { label: "Đi tập tuần này", value: "28", icon: "zi-check-circle", color: "text-green-600", bg: "bg-green-50", abbrev: "ĐT" },
  { label: "Buổi dạy tuần này", value: "67", icon: "zi-calendar", color: "text-purple-600", bg: "bg-purple-50", abbrev: "BD" },
  { label: "Bản ghi InBody", value: "156", icon: "zi-chart-line", color: "text-orange-600", bg: "bg-orange-50", abbrev: "InBody" },
];

// Mock data for inactive clients (7-10 days)
const inactiveClients = [
  { id: 1, name: "Nguyễn Văn An", lastActive: "8 ngày chưa tương tác", avatar: "https://i.pravatar.cc/150?u=1", phone: "0901 234 567", lastWorkout: "2026-10-05" },
  { id: 2, name: "Trần Thị Bình", lastActive: "9 ngày chưa tương tác", avatar: "https://i.pravatar.cc/150?u=2", phone: "0912 345 678", lastWorkout: "2026-10-04" },
  { id: 3, name: "Lê Văn Cường", lastActive: "7 ngày chưa tương tác", avatar: "https://i.pravatar.cc/150?u=3", phone: "0923 456 789", lastWorkout: "2026-10-06" },
  { id: 4, name: "Phạm Thị Dung", lastActive: "10 ngày chưa tương tác", avatar: "https://i.pravatar.cc/150?u=4", phone: "0934 567 890", lastWorkout: "2026-10-03" },
  { id: 5, name: "Hoàng Văn Em", lastActive: "8 ngày chưa tương tác", avatar: "https://i.pravatar.cc/150?u=5", phone: "0945 678 901", lastWorkout: "2026-10-05" },
];

function StatCard({ label, value, abbrev, color, bg }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 ${bg} dark:bg-gray-800 dark:border dark:border-gray-700`}>
      <div className={`p-3 rounded-lg ${bg} dark:bg-gray-700 flex items-center justify-center`}>
        <span className={`${color} font-bold text-2xl`}>{abbrev}</span>
      </div>
      <div>
        <Text className="text-sm text-gray-500 dark:text-gray-400">{label}</Text>
        <Text.Title size="large" className="font-bold text-gray-900 dark:text-white">{value}</Text.Title>
      </div>
    </div>
  );
}

function InactiveClientCard({ client, onClick }) {
  return (
    <div
      className="bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-300 p-3.5 flex items-center justify-between cursor-pointer"
      onClick={() => onClick(client)}
    >
      <Avatar size="large" src={client.avatar} alt={client.name} />
      <div className="flex-1 min-w-0 space-y-1">
        <Text.Title size="medium" className="font-semibold text-gray-900 dark:text-white truncate">{client.name}</Text.Title>
        <Text className="text-sm text-gray-500 dark:text-gray-400 truncate">{client.phone}</Text>
      </div>
      <div className="flex items-center gap-2">
        <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold">
          {client.lastActive}
        </span>
        <Icon icon="zi-chevron-right" size="20" className="text-gray-400" />
      </div>
    </div>
  );
}

function InactiveClientDetailView({ client, onClose, onMarkContacted }) {
  return (
    <Page className="bg-slate-100 dark:bg-slate-900 min-h-screen">
      <div
        className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-slate-100 dark:bg-slate-900 z-30 pr-24"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 44px), 44px)' }}
      >
        <Button variant="text" size="small" icon={<Icon icon="zi-chevron-left" size="18" />} onClick={onClose} className="flex-shrink-0">
          Quay lại
        </Button>
        <Avatar size="xlarge" src={client.avatar} alt={client.name} />
        <div className="flex-1 min-w-0">
          <Text.Title size="large" className="font-bold text-gray-900 dark:text-white truncate">{client.name}</Text.Title>
          <Text className="text-gray-500 dark:text-gray-400">{client.phone}</Text>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <Text className="font-medium text-gray-900 dark:text-white">Trạng thái</Text>
            <Text className="font-semibold text-gray-900 dark:text-white">{client.lastActive}</Text>
          </div>
          <div className="flex items-center justify-between mb-2">
            <Text className="font-medium text-gray-900 dark:text-white">Lần tập cuối</Text>
            <Text className="font-semibold text-gray-900 dark:text-white">{client.lastWorkout}</Text>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Đóng</Button>
          <Button variant="primary" onClick={onMarkContacted}>Đã liên hệ qua Zalo</Button>
        </div>
      </div>
    </Page>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const [showAddNote, setShowAddNote] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'newClient':
        navigate('/clients');
        break;
      case 'schedule':
        navigate('/workouts');
        break;
      case 'inbody':
        navigate('/progress');
        break;
      case 'note':
        setShowAddNote(!showAddNote);
        break;
      default:
        break;
    }
  };

  const handleClientClick = (client) => {
    setSelectedClient(client);
  };

  const handleMarkContacted = () => {
    // In a real app, you would call an API to mark as contacted
    setSelectedClient(null);
  };

  return (
    <Page className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {selectedClient !== null ? (
        <InactiveClientDetailView
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onMarkContacted={handleMarkContacted}
        />
      ) : (
        <>
          {/* Header — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
          <div
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 pb-3 sticky top-0 z-30 pr-24"
            style={{ paddingTop: 'max(env(safe-area-inset-top, 44px), 44px)' }}
          >
            <div className="flex items-center">
              <div className="flex-1 min-w-0">
                <Text.Title size="xLarge" className="font-bold text-gray-900 dark:text-white">Tổng quan</Text.Title>
                <Text className="text-sm text-gray-500 dark:text-gray-400">Xin chào! Dưới đây là tình hình học viên hôm nay.</Text>
              </div>
            </div>
          </div>

          {/* Sub-header: Action Button Row — sits below the title bar, fully clickable */}
          <div className="px-4 pt-3 pb-1 flex justify-end">
            <Button variant="primary" size="small" icon={<Icon icon="zi-plus" size="18" />} onClick={() => navigate('/clients')}>
              + Thêm học viên
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6 pb-28 overflow-y-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            {/* Inactive Clients Section */}
            <div className="bg-white rounded-xl shadow-sm dark:bg-gray-800 dark:border dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <Text.Title size="large" className="font-bold text-gray-900 dark:text-white">
                  Học viên cần hỏi thăm (7-10 ngày)
                </Text.Title>
                <Button variant="text" size="small" onClick={() => navigate('/clients')}>Xem tất cả</Button>
              </div>
              <div className="p-4 space-y-3">
                {inactiveClients.map((client) => (
                  <InactiveClientCard key={client.id} client={client} onClick={handleClientClick} />
                ))}
                {inactiveClients.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Icon icon="zi-check-circle" size="48" className="mx-auto mb-2 text-green-500" />
                    <Text>Không có học viên cần hỏi thăm. Tuyệt vời!</Text>
                  </div>
                )}
              </div>
            </div>

            {/* Management Menu */}
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-3 dark:bg-gray-800 dark:border dark:border-gray-700">
              <Text.Title size="medium" className="font-bold text-gray-900 dark:text-white">Danh mục quản lý</Text.Title>
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-blue-100 border-2 border-blue-300 text-blue-800 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm" onClick={() => navigate('/clients')}>
                  Quản lý học viên
                </Button>
                <Button className="bg-indigo-100 border-2 border-indigo-300 text-indigo-800 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm" onClick={() => navigate('/workouts')}>
                  Lịch &amp; Buổi tập
                </Button>
                <Button className="bg-emerald-100 border-2 border-emerald-300 text-emerald-800 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm" onClick={() => navigate('/progress')}>
                  Chỉ số InBody
                </Button>
                <Button className="bg-amber-100 border-2 border-amber-300 text-amber-800 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm" onClick={() => setShowAddNote(!showAddNote)}>
                  Ghi chú nhanh
                </Button>
              </div>
            </div>
          </div>

          {/* Note Creation Overlay */}
          {showAddNote && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 pointer-events-none">
              <div className="bg-white rounded-xl shadow-sm p-6 w-full max-w-md pointer-events-all">
                <div className="flex items-center justify-between pb-2">
                  <Text.Title size="medium" className="font-bold text-gray-900">Thêm ghi chú nhanh</Text.Title>
                  <Button variant="text" size="small" onClick={() => setShowAddNote(false)}>
                    <Icon icon="zi-close" size="20" className="text-gray-500" />
                  </Button>
                </div>
                <form onSubmit={e => {
                  e.preventDefault();
                  // In a real app, you would save the note
                  setShowAddNote(false);
                }} className="space-y-4">
                  <div>
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nội dung ghi chú</Text>
                    <textarea
                      rows={4}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Nhập ghi chú..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowAddNote(false)}>
                      Hủy
                    </Button>
                    <Button variant="primary" onClick={() => setShowAddNote(false)}>
                      Lưu
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </Page>
  );
}

export default DashboardPage;
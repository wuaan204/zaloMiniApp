import { Page, Text, Button, Icon, useNavigate } from "zmp-ui";
import React from "react";

function ProgressPage() {
  const navigate = useNavigate();

  return (
    <Page className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
      <div
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 pb-3 sticky top-0 z-30 pr-24"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 44px), 44px)' }}
      >
        <div className="flex items-center gap-2">
          <Button variant="text" size="small" icon={<Icon icon="zi-chevron-left" size="18" />} onClick={() => navigate('/')}>Quay lại</Button>
          <div className="flex-1 min-w-0">
            <Text.Title size="xLarge" className="font-bold text-gray-900 dark:text-white">Tiến độ InBody</Text.Title>
            <Text className="text-sm text-gray-500 dark:text-gray-400">Theo dõi thành phần cơ thể</Text>
          </div>
        </div>
      </div>

      {/* Sub-header: Action Button Row — sits below the title bar, fully clickable */}
      <div className="px-4 pt-3 pb-1 flex justify-end">
        <Button variant="primary" size="small" icon={<Icon icon="zi-plus" size="18" />}>
          + Nhập InBody
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center dark:bg-gray-800 dark:border dark:border-gray-700">
          <Icon icon="zi-chart-line" size="64" className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <Text.Title size="large" className="font-bold text-gray-900 dark:text-white mb-2">Trang tiến độ InBody</Text.Title>
          <Text className="text-gray-500 dark:text-gray-400 mb-4">Các tính năng theo dõi tiến độ sẽ sớm được cập nhật.</Text>
          <Text className="text-sm text-gray-400 dark:text-gray-500">
            Trang này sẽ bao gồm: Lịch sử đo InBody, biểu đồ xu hướng cân nặng/cơ/béo, so sánh, và tùy chọn xuất dữ liệu.
          </Text>
        </div>
      </div>
    </Page>
  );
}

export default ProgressPage;
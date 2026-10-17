import { Page, Text, Box, Button, Icon } from "zmp-ui";
import React from "react";

function ProgressPage() {
  return (
    <Page className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 pt-13 sticky top-0 z-30 safe-area-top pr-24">
        <div className="flex items-center justify-between">
          <div>
            <Text.Title size="xLarge" className="font-bold text-gray-900 dark:text-white">Tiến độ InBody</Text.Title>
            <Text className="text-sm text-gray-500 dark:text-gray-400">Theo dõi thành phần cơ thể</Text>
          </div>
        </div>
      </div

      {/* Action Button Row */}
      <div className="p-4 flex justify-end">
        <Button variant="primary" size="small" icon={<Icon icon="zi-plus" size="18" />}>
          Nhập InBody
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center dark:bg-gray-800 dark:border dark:border-gray-700">
          <Icon icon="zi-chart-line" size="64" className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <Text.Title size="large" className="font-bold text-gray-900 dark:text-white mb-2">Trang tiến độ InBody</Text.Title>
          <Text className="text-gray-500 dark:text-gray-400 mb-4">Các tính năng theo dõi tiến độ sẽ sớm được cập nhật.</Text>
          <Text className="text-sm text-gray-400 dark:text-gray-500">
            Trang này sẽ bao gồm: Lịch sử đo InBody, biểu đồ xu hướng cân nặng/cơ/béo,視圖比較, và tùy chọn xuất dữ liệu.
          </Text>
        </div>>
      </div>>
    </Page>
  );
}

export default ProgressPage;
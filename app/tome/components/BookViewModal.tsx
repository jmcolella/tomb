"use client";

import { useState } from "react";
import { Modal, Table, Tag, Alert, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import {
  BookApiEntity,
  BookEventApiEntity,
  BookEventApiOrderBy,
} from "@/app/api/books/types";
import { BookEventType } from "@/app/server/books/types";
import useGetBookEvents from "@/app/tome/hooks/books/useGetBookEvents";
import dayjs from "dayjs";

interface BookViewModalProps {
  open: boolean;
  book: BookApiEntity;
  onClose: () => void;
}

function getEventTypeColor(eventType: BookEventType): string {
  switch (eventType) {
    case BookEventType.ADD_TO_LIBRARY:
      return "blue";
    case BookEventType.STARTED:
      return "green";
    case BookEventType.PROGRESS:
      return "orange";
    case BookEventType.COMPLETED:
      return "purple";
    case BookEventType.ARCHIVED:
      return "red";
    default:
      return "default";
  }
}

export default function BookViewModal({
  open,
  book,
  onClose,
}: BookViewModalProps) {
  const [sortOrder, setSortOrder] = useState<BookEventApiOrderBy>("desc");
  const { events, isLoading, error } = useGetBookEvents(book.sid, sortOrder);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const columns: ColumnsType<BookEventApiEntity> = [
    {
      title: (
        <Space>
          Date Effective
          <Button
            type="text"
            size="small"
            icon={sortOrder === "asc" ? <UpOutlined /> : <DownOutlined />}
            onClick={toggleSort}
            style={{ padding: 0, height: "auto" }}
          />
        </Space>
      ),
      dataIndex: "dateEffective",
      key: "dateEffective",
      render: (date: Date) => dayjs(date).format("MMM DD, YYYY"),
    },
    {
      title: "Event Type",
      dataIndex: "eventType",
      key: "eventType",
      render: (eventType: BookEventType) => (
        <Tag color={getEventTypeColor(eventType)}>{eventType}</Tag>
      ),
    },
    {
      title: "Current Page",
      dataIndex: "pageNumber",
      key: "pageNumber",
      render: (pageNumber: number | null) => pageNumber ?? "N/A",
    },
  ];

  return (
    <Modal
      title={`Event History: ${book.title}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {error && (
        <Alert
          title={error.message}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Table
        columns={columns}
        dataSource={events || []}
        rowKey={(record) => record.sid}
        loading={isLoading}
        pagination={false}
      />
    </Modal>
  );
}

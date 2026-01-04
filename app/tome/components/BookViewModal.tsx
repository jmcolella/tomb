"use client";

import { useState } from "react";
import {
  Modal,
  Table,
  Tag,
  Alert,
  Button,
  Space,
  Row,
  Col,
  Statistic,
  Card,
  Progress,
  theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import {
  BookApiEntity,
  BookEventApiEntity,
  BookEventApiOrderBy,
} from "@/app/api/books/types";
import { BookEventType } from "@/app/server/books/types";
import useGetBookEvents from "@/app/tome/hooks/books/useGetBookEvents";
import { useBookMetrics } from "@/app/tome/hooks/books/useBookMetrics";
import dayjs from "dayjs";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  BarController,
  LinearScale,
} from "chart.js";

ChartJS.register(CategoryScale, BarElement, BarController, LinearScale);

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
  const [showHistory, setShowHistory] = useState(false);
  const { events, isLoading, error } = useGetBookEvents(book.sid, sortOrder);
  const metrics = useBookMetrics(events, book);
  const { token } = theme.useToken();

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
      title={book.title}
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

      {metrics && (
        <>
          <Card title="Progress" style={{ marginBottom: token.marginLG }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Progress
                  type="circle"
                  percent={metrics.percentComplete}
                  size={100}
                  strokeColor={token.colorSuccess}
                  railColor={
                    metrics.isCompleted
                      ? token.colorSuccess
                      : token.colorTextDescription
                  }
                  format={(percent) => `${percent}%`}
                />
              </Col>
              <Col span={12}>
                {metrics.isCompleted ? (
                  <Statistic title="Status" value="Completed" />
                ) : metrics.estimatedCompletion ? (
                  <Statistic
                    title="Est. Completion"
                    value={metrics.estimatedCompletion.format("MMM DD, YYYY")}
                  />
                ) : (
                  <Statistic title="Est. Completion" value="N/A" />
                )}
              </Col>
            </Row>
          </Card>
          <Card
            style={{ marginBottom: token.marginLG }}
            size="small"
            title="Reading Metrics"
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic
                  title="Total Days"
                  value={metrics.totalDays}
                  suffix="days"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Avg Pages/Day"
                  value={metrics.avgPagesPerDay}
                  precision={1}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Best Period Avg"
                  value={metrics.bestPeriod.avg}
                  precision={1}
                />
                {metrics.bestPeriod.start && metrics.bestPeriod.end && (
                  <div
                    style={{
                      fontSize: token.fontSizeSM,
                      color: token.colorTextSecondary,
                    }}
                  >
                    {dayjs(metrics.bestPeriod.start).format("MMM DD")} -{" "}
                    {dayjs(metrics.bestPeriod.end).format("MMM DD")}
                  </div>
                )}
              </Col>
            </Row>
          </Card>

          <Bar
            data={{
              labels: metrics.periods.map((period) =>
                dayjs(period.end).format("MMM DD")
              ),
              datasets: [
                {
                  label: "Pages Read",
                  data: metrics.periods.map((period) => period.pageCount),
                  borderColor: token.colorBorder,
                  backgroundColor: token.colorPrimary,
                },
              ],
            }}
            options={{}}
          />
        </>
      )}

      <div style={{ marginBottom: 16 }}>
        <Button
          type="link"
          onClick={() => setShowHistory(!showHistory)}
          icon={showHistory ? <UpOutlined /> : <DownOutlined />}
          style={{ padding: 0 }}
        >
          {showHistory ? "Hide Event History" : "Show Event History"}
        </Button>
      </div>

      {showHistory && (
        <Table
          columns={columns}
          dataSource={events || []}
          rowKey={(record) => record.sid}
          loading={isLoading}
          pagination={false}
        />
      )}
    </Modal>
  );
}

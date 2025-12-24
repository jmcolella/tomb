import { getBooks } from '@/app/server/books/api';
import { List, Typography, Tag, Alert, Empty } from 'antd';

const { Title, Text } = Typography;

export default async function BooksList() {
  const { data: books, error } = await getBooks();

  if (error) {
    return (
      <Alert
        message="Error loading books"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  if (!books || books.length === 0) {
    return (
      <div>
        <Title level={2}>Your Books</Title>
        <Empty description="No books added yet." />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READ':
        return 'success';
      case 'READING':
        return 'processing';
      case 'SHELF':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div>
      <Title level={2}>Your Books</Title>
      <List
        dataSource={books}
        renderItem={(book) => (
          <List.Item>
            <List.Item.Meta
              title={book.title}
              description={
                <div>
                  {book.authorName && (
                    <Text type="secondary">by {book.authorName}</Text>
                  )}
                  {book.status && (
                    <div style={{ marginTop: 8 }}>
                      <Tag color={getStatusColor(book.status)}>
                        {book.status}
                      </Tag>
                    </div>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}

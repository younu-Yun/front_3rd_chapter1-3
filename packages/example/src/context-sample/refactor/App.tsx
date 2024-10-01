import React, { createContext, useContext, useState, useCallback, useMemo, PropsWithChildren } from 'react';

// 타입 정의
type Theme = 'light' | 'dark';
type NewsCategory = '정치' | '경제' | '사회' | '문화';

interface NewsItem {
  id: number;
  title: string;
  category: NewsCategory;
  content: string;
  likes: number;
}

interface User {
  name: string;
  email: string;
}

interface Notification {
  id: number;
  message: string;
}

// Context 정의
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

interface UserContextType {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
}

interface NewsContextType {
  news: NewsItem[];
  addNews: (news: Omit<NewsItem, 'id' | 'likes'>) => void;
  likeNews: (id: number) => void;
  filteredNews: NewsItem[];
  setCategory: (category: NewsCategory | null) => void;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string) => void;
  removeNotification: (id: number) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);
const UserContext = createContext<UserContextType | null>(null);
const NewsContext = createContext<NewsContextType | null>(null);
const NotificationContext = createContext<NotificationContextType | null>(null);

// Provider 컴포넌트
const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const login = useCallback((name: string, email: string) => {
    setUser({ name, email });
  }, []);
  const logout = useCallback(() => {
    setUser(null);
  }, []);
  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const NewsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [category, setCategory] = useState<NewsCategory | null>(null);

  const addNews = useCallback((newNews: Omit<NewsItem, 'id' | 'likes'>) => {
    setNews(prev => [...prev, { ...newNews, id: Date.now(), likes: 0 }]);
  }, []);

  const likeNews = useCallback((id: number) => {
    setNews(prev => prev.map(item =>
      item.id === id ? { ...item, likes: item.likes + 1 } : item
    ));
  }, []);

  const filteredNews = useMemo(() =>
      category ? news.filter(item => item.category === category) : news,
    [news, category]
  );

  const value = useMemo(() => ({
    news, addNews, likeNews, filteredNews, setCategory
  }), [news, addNews, likeNews, filteredNews, setCategory]);

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};

const NotificationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string) => {
    setNotifications(prev => [...prev, { id: Date.now(), message }]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const value = useMemo(() => ({
    notifications, addNotification, removeNotification
  }), [notifications, addNotification, removeNotification]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// 커스텀 훅
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error('useNews must be used within a NewsProvider');
  return context;
};

const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};

// 컴포넌트
const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useUser();
  const { notifications } = useNotification();

  return (
    <header className={`p-4 ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">뉴스 피드</h1>
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="px-3 py-1 rounded bg-gray-200 text-gray-800">
            {theme === 'light' ? '다크 모드' : '라이트 모드'}
          </button>
          {user && <span>{user.name}님 환영합니다</span>}
          {user && <button onClick={logout} className="px-3 py-1 rounded bg-red-500 text-white">로그아웃</button>}
          <div className="relative">
            <span className="cursor-pointer">🔔</span>
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const LoginForm = () => {
  const { login } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(name, email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름"
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">로그인</button>
    </form>
  );
};

const NewsItem = React.memo(({ item }: { item: NewsItem }) => {
  const { likeNews } = useNews();
  const { theme } = useTheme();

  return (
    <div className={`p-4 mb-4 rounded shadow ${theme === 'light' ? 'bg-white' : 'bg-gray-700 text-gray-200'}`}>
      <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
      <p className="mb-2">{item.content}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{item.category}</span>
        <button
          onClick={() => likeNews(item.id)}
          className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
        >
          좋아요 ({item.likes})
        </button>
      </div>
    </div>
  );
});

const NewsList = () => {
  const { filteredNews } = useNews();

  return (
    <div>
      {filteredNews.map(item => (
        <NewsItem key={item.id} item={item} />
      ))}
    </div>
  );
};

const CategoryFilter = () => {
  const { setCategory } = useNews();
  const categories: (NewsCategory | 'all')[] = ['all', '정치', '경제', '사회', '문화'];

  return (
    <div className="mb-4 space-x-2">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => setCategory(cat === 'all' ? null : cat)}
          className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

const AddNewsForm = () => {
  const { addNews } = useNews();
  const { addNotification } = useNotification();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NewsCategory>('정치');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNews({ title, content, category });
    addNotification(`새 뉴스가 추가되었습니다: ${title}`);
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        className="w-full p-2 border rounded"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
        className="w-full p-2 border rounded"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as NewsCategory)}
        className="w-full p-2 border rounded"
      >
        <option value="정치">정치</option>
        <option value="경제">경제</option>
        <option value="사회">사회</option>
        <option value="문화">문화</option>
      </select>
      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">뉴스 추가</button>
    </form>
  );
};

const NotificationList = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-16 right-4 w-64 space-y-2">
      {notifications.map(notif => (
        <div key={notif.id} className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 relative">
          <button
            onClick={() => removeNotification(notif.id)}
            className="absolute top-0 right-0 mt-1 mr-1 text-yellow-700 hover:text-yellow-900"
          >
            &times;
          </button>
          {notif.message}
        </div>
      ))}
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <NewsProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-gray-100">
              <Header />
              <div className="container mx-auto py-8">
                <CategoryFilter />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <NewsList />
                  </div>
                  <div>
                    <AddNewsForm />
                    <LoginForm />
                  </div>
                </div>
              </div>
              <NotificationList />
            </div>
          </NotificationProvider>
        </NewsProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;

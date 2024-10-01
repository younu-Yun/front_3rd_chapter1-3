import { PropsWithChildren, useState } from 'react';

type NewsCategory = '정치' | '경제' | '사회' | '문화';

interface NewsItem {
  id: number;
  title: string;
  category: NewsCategory
  likes: number;
  content: string;
}

const NEWS_CATEGORIES = ['정치', '경제', '사회', '문화'] as const;

const generateNewsData = (count: number): NewsItem[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `뉴스 제목 ${index + 1}`,
    category: [...NEWS_CATEGORIES].sort(() => Math.random() - 0.5)[0],
    likes: Math.floor(Math.random() * 100),
    content: `이것은 뉴스 ${index + 1}의 내용입니다. 실제 내용은 더 길 것입니다.`
  }));
};

const newsItems = generateNewsData(50);


const Header = ({ totalLikes }: { totalLikes: number }) => (
  <header className="bg-blue-600 text-white p-4">
    <h1 className="text-2xl font-bold">뉴스 피드</h1>
    <p className="text-sm">총 좋아요 수: {totalLikes}</p>
  </header>
);

const SidebarItem = ({
                       selected = false,
                       onClick,
                       children
                     }: PropsWithChildren<{
  selected?: boolean,
  onClick?: () => void
}>) => {
  const className = selected
    ? 'bg-blue-500 text-white hover:bg-blue-600'
    : 'bg-gray-200 text-gray-800 hover:bg-gray-300';

  return (
    <button
      onClick={onClick}
      className={`w-full mb-2 px-4 py-2 rounded ${className}`}
    >
      {children}
    </button>
  );
};

const Sidebar = ({
                   items,
                   value,
                   change,
                 }: {
  items: (NewsCategory | null)[]
  value: NewsCategory | null,
  change: (category: NewsCategory | null) => void,
}) => (
  <aside className="w-64 bg-white p-4">
    {items
      .map((item, index) => (
        <SidebarItem
          key={index}
          selected={value === item}
          onClick={() => change(item)}
        >
          {item ?? '전체'}
        </SidebarItem>
      ))
    }
  </aside>
);

const NewsCard = ({ item, onLike }: { item: NewsItem, onLike: (id: number) => void }) => (
  <div className="bg-white p-4 mb-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
    <p className="text-gray-600 mb-2">{item.content}</p>
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{item.category}</span>
      <button
        onClick={() => onLike(item.id)}
        className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200"
      >
        좋아요 ({item.likes})
      </button>
    </div>
  </div>
);

const NewsFeed = ({ news, onLike }: { news: NewsItem[], onLike: (id: number) => void }) => (
  <main className="flex-1 p-4">
    {news.map((item) => (
      <NewsCard key={item.id} item={item} onLike={onLike}/>
    ))}
  </main>
);

const App = () => {
  const [news, setNews] = useState(newsItems);
  const [category, setCategory] = useState<NewsCategory | null>(null);

  const filteredNews = category
    ? news.filter(item => item.category === category)
    : news;

  const totalLikes = news.reduce((sum, item) => sum + item.likes, 0);

  const changeCategory = (newCategory: NewsCategory | null) => {
    setCategory(newCategory);
  };

  const likeFeed = (id: number) => {
    setNews(news.map(item =>
      item.id === id ? { ...item, likes: item.likes + 1 } : item
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header totalLikes={totalLikes}/>
      <div className="flex">
        <Sidebar
          items={[null, ...NEWS_CATEGORIES]}
          value={category}
          change={changeCategory}
        />
        <NewsFeed news={filteredNews} onLike={likeFeed}/>
      </div>
    </div>
  );
};

export default App;

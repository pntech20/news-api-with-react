import "./styles.scss";
import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { Modal } from "antd";

const WorldMap = require("react-world-map");

interface Article {
  source: Source;
  author: null | string;
  title: string;
  description: null | string;
  url: string;
  urlToImage: null | string;
  publishedAt: Date;
  content: null | string;
}
export interface Source {
  id: null | string;
  name: string;
}
export default function Articles() {
  const timeoutRef = useRef<any>(null);
  const [article, setArticle] = useState<Article[]>([]);
  const [filter, setFilter] = useState("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [articleDetail, setArticleDetail] = useState<Article>();

  const showModal = useCallback((item) => {
    setIsModalVisible(true);
    setArticleDetail(item);
  }, []);

  useEffect(() => {
    const getArticle = async () => {
      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?q=${filter}&country=us&category=business&apiKey=c6d785f7a860438fa9af99c89ea41bad`
        );
        setArticle(response.data.articles);
      } catch (error) {
        console.log(error.message);
      }
    };
    getArticle();
  }, [filter]);

  const handleChange = useCallback(
    (e) => {
      if (timeoutRef) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        if (e.target.value.length < 3 && e.target.value.length > 0) {
          return;
        } else {
          return setFilter(e.target.value);
        }
      }, 500);
    },
    [setFilter]
  );

  return (
    <div className="container">
      <div className="article">
        <div>
          <div className="header">
            <input
              className="input"
              placeholder="Search for..."
              maxLength={256}
              onChange={handleChange}
            />
          </div>
          <div className="article-list">
            {article.map((item, index) => (
              <div key={index} className="article-item">
                <p className="title">{item.title}</p>
                <img
                  onClick={() => showModal(item)}
                  src={item?.urlToImage || ""}
                  alt="not found"
                />
              </div>
            ))}
          </div>
        </div>
        <WorldMap />
      </div>
      <Modal
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <p className="title-detail">{articleDetail?.title}</p>
        <img
          className="img-detail"
          src={articleDetail?.urlToImage || ""}
          alt="not found"
        />
        <p className="content">{articleDetail?.content}</p>
        <div className="button">Read full article</div>
      </Modal>
    </div>
  );
}

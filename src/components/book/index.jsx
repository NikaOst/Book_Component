import { forwardRef, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styles from './styles.module.css';
import wingedHussar from '../../assets/images/Winged_Hussar.png';
import cossackSerdyuk from '../../assets/images/Cossack_Serdyuk.png';
import belts from '../../assets/images/belts.png';

const Page = forwardRef(function Page({ children, onClick, className = '' }, ref) {
  return (
    <div ref={ref} className={`${styles.page} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
});

const sketches = [wingedHussar, cossackSerdyuk];

function Book() {
  const bookRef = useRef(null);
  const unlockTimeoutRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isCoverUnlocking, setIsCoverUnlocking] = useState(false);
  const contentPages = [
    {
      // title: 'Страница 1',
      // text: 'Клик справа — вперед, клик слева — назад.',
    },
    {
      // title: 'Страница 2',
      // text: 'Перелистывание работает прямо по нажатию на лист.',
    },
    ...Array.from({ length: 2 }, () => ({
      // title: `Страница ${index + 3}`,
      // text: 'Про игру',
    })),
  ];
  const totalPages = contentPages.length + 1;

  useEffect(() => {
    return () => {
      if (unlockTimeoutRef.current) {
        window.clearTimeout(unlockTimeoutRef.current);
      }
    };
  }, []);

  const handlePageClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const isLeftSideClick = event.clientX < centerX;
    const pageFlip = bookRef.current?.pageFlip();

    if (!pageFlip) {
      return;
    }

    if (currentPage === 0) {
      if (isCoverUnlocking) {
        return;
      }

      setIsCoverUnlocking(true);
      unlockTimeoutRef.current = window.setTimeout(() => {
        pageFlip.flipNext();
        setIsCoverUnlocking(false);
      }, 620);
      return;
    }

    if (isLeftSideClick) {
      if (currentPage <= 0) {
        return;
      }

      pageFlip.flipPrev();
      return;
    }

    if (currentPage >= totalPages - 1) {
      return;
    }

    pageFlip.flipNext();
  };

  return (
    <div className={styles.wrap}>
      <HTMLFlipBook
        ref={bookRef}
        width={450}
        height={530}
        minWidth={360}
        maxWidth={740}
        minHeight={470}
        maxHeight={920}
        showCover
        disableFlipByClick
        useMouseEvents={false}
        mobileScrollSupport={false}
        onFlip={(event) => setCurrentPage(event.data)}
        className={styles.flipBook}>
        <Page
          onClick={handlePageClick}
          className={`${styles.coverPage} ${isCoverUnlocking ? styles.coverUnlocking : ''}`}>
          <img src={belts} alt="Belts" className={styles.coverBelts} />
        </Page>

        {contentPages.map((page, index) => {
          const isSecondPage = index % 2 === 1;
          const sketchIndex = Math.floor(index / 2) % sketches.length;

          return (
            <Page
              key={`${page.title || 'page'}-${index}`}
              onClick={handlePageClick}
              className={isSecondPage ? styles.secondPage : ''}>
              {isSecondPage ? (
                <img
                  // src={sketches[sketchIndex]}
                  alt={`Sketch ${sketchIndex + 1}`}
                  className={styles.sketchImage}
                />
              ) : (
                <>
                  <h2 className={styles.title}>{page.title}</h2>
                  <p className={styles.text}>{page.text}</p>
                </>
              )}
            </Page>
          );
        })}
      </HTMLFlipBook>
    </div>
  );
}

export default Book;

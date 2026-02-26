import { forwardRef, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styles from './styles.module.css';
import wingedHussar from '../../assets/images/Winged_Hussar.png';
import cossackSerdyuk from '../../assets/images/Cossack_Serdyuk.png';
import belts from '../../assets/images/belts.png';
import background from '../../assets/images/background_book.png';

const sketches = [wingedHussar, cossackSerdyuk];

// компонент страницы
const Page = forwardRef(function Page({ children, onClick, className = '' }, ref) {
  return (
    <div ref={ref} className={`${styles.page} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
});

function Book({ shouldOpen = false }) {
  const bookRef = useRef(null);
  const unlockTimeoutRef = useRef(null);
  const beltsHideTimeoutRef = useRef(null);
  const hasAutoOpenedRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isCoverUnlocking, setIsCoverUnlocking] = useState(false);
  const [isBeltsHidden, setIsBeltsHidden] = useState(false);
  const contentPages = [
    {
      title: 'Title',
      text: 'text',
    },
    {},
    {
      title: 'Title',
      text: 'text',
    },
    {},
  ];
  const totalPages = contentPages.length + 1;

  // trigger auto-open if shouldOpen is true (only once)
  useEffect(() => {
    if (shouldOpen && !hasAutoOpenedRef.current) {
      hasAutoOpenedRef.current = true;
      // small delay to ensure flipbook is mounted and ready
      const delayedOpen = window.setTimeout(() => {
        if (bookRef.current?.pageFlip) {
          setIsCoverUnlocking(true);
          setIsBeltsHidden(false);
          beltsHideTimeoutRef.current = window.setTimeout(() => {
            setIsBeltsHidden(true);
          }, 420);
          unlockTimeoutRef.current = window.setTimeout(() => {
            bookRef.current?.pageFlip().flipNext();
            setIsCoverUnlocking(false);
          }, 860);
        }
      }, 100);
      
      return () => window.clearTimeout(delayedOpen);
    }
  }, [shouldOpen]);

  // clean up timeouts
  useEffect(() => {
    return () => {
      if (unlockTimeoutRef.current) {
        window.clearTimeout(unlockTimeoutRef.current);
      }

      if (beltsHideTimeoutRef.current) {
        window.clearTimeout(beltsHideTimeoutRef.current);
      }
    };
  }, []);

  // событие нажатия на страницы
  const handlePageClick = (event) => {
    // размеры и позиция элемента
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const isLeftSideClick = event.clientX < centerX;
    // ссылка на методы книги
    const pageFlip = bookRef.current?.pageFlip();

    if (!pageFlip) {
      return;
    }

    if (currentPage === 0) {
      if (isCoverUnlocking) {
        return;
      }

      setIsCoverUnlocking(true);
      setIsBeltsHidden(false);
      beltsHideTimeoutRef.current = window.setTimeout(() => {
        setIsBeltsHidden(true);
      }, 420);
      unlockTimeoutRef.current = window.setTimeout(() => {
        pageFlip.flipNext();
        setIsCoverUnlocking(false);
      }, 860);
      return;
    }

    // если клик по левой стороне, перевернуть назад
    if (isLeftSideClick) {
      if (currentPage <= 0) {
        return;
      }

      pageFlip.flipPrev();
      return;
    }

    // чтобы последняя страница не перелистывалась
    if (currentPage >= totalPages - 1) {
      return;
    }

    pageFlip.flipNext();
  };

  return (
    <div className={styles.bookContainer}>
      <div className={styles.wrap}>
        <img className={styles.backgroundBook} src={background} alt="background_book" />

        <div className={styles.bookLayer}>
          <HTMLFlipBook
            ref={bookRef}
            width={440}
            height={500}
            minWidth={360}
            maxWidth={740}
            minHeight={470}
            maxHeight={920}
            showCover
            disableFlipByClick
            useMouseEvents={false}
            mobileScrollSupport={false}
            onFlip={(event) => {
              setCurrentPage(event.data);

              if (event.data === 0) {
                setIsBeltsHidden(false);
              }
            }}
            className={styles.flipBook}>
            {/* обложка + ремни */}
            <Page
              onClick={handlePageClick}
              className={`${styles.coverPage} ${isCoverUnlocking ? styles.coverUnlocking : ''}`}>
              <img
                src={belts}
                alt="Belts"
                className={`${styles.coverBelts} ${isBeltsHidden ? styles.coverBeltsHidden : ''}`}
              />
            </Page>

            {contentPages.map((page, index) => {
              const isSecondPage = index % 2 === 1;
              const sketchIndex = Math.floor(index / 2) % sketches.length;

              return (
                <Page
                  key={`${page.title || 'page'}_${index}`}
                  onClick={handlePageClick}
                  className={isSecondPage ? styles.secondPage : ''}>
                  {isSecondPage ? (
                    <img
                      src={sketches[sketchIndex]}
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
      </div>
    </div>
  );
}

export default Book;

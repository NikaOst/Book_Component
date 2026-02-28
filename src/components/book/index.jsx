import { forwardRef, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styles from './styles.module.css';
import wingedHussar from '../../assets/images/Winged_Hussar.png';
import cossackSerdyuk from '../../assets/images/Cossack_Serdyuk.png';
import Ottoman_Elite_Janissary from '../../assets/images/Ottoman_Elite_Janissary.png';
import belts from '../../assets/images/belts.png';
import background from '../../assets/images/background_book.png';
import button from '../../assets/images/button_old.png';
import cornerLeft from '../../assets/images/corner_left.png';
import cornerRight from '../../assets/images/corner_right.png';

const sketches = [wingedHussar, cossackSerdyuk, Ottoman_Elite_Janissary];

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
  const preOpenShiftTimeoutRef = useRef(null);
  const unlockTimeoutRef = useRef(null);
  const beltsHideTimeoutRef = useRef(null);
  const hasAutoOpenedRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPreOpenShift, setIsPreOpenShift] = useState(false);
  const [isCoverUnlocking, setIsCoverUnlocking] = useState(false);
  const [isBeltsHidden, setIsBeltsHidden] = useState(false);
  const contentPages = [
    {
      title: 'Title',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero suscipit porro, quidem sit, aperiam quasi nihil commodi possimus asperiores adipisci culpa rem mollitia ea ut consequatur, inventore velit a ex!',
    },
    {},
    {
      title: 'Title',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero suscipit porro, quidem sit, aperiam quasi nihil commodi possimus asperiores adipisci culpa rem mollitia ea ut consequatur, inventore velit a ex!',
    },
    {},
    {
      title: 'Title',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero suscipit porro, quidem sit, aperiam quasi nihil commodi possimus asperiores adipisci culpa rem mollitia ea ut consequatur, inventore velit a ex!',
    },
    {},
  ];
  const totalPages = contentPages.length + 1;

  const runOpenSequence = (pageFlip) => {
    if (!pageFlip || isCoverUnlocking) {
      return;
    }

    setIsCoverUnlocking(true);
    setIsBeltsHidden(false);

    beltsHideTimeoutRef.current = window.setTimeout(() => {
      setIsBeltsHidden(true);
    }, 420);

    preOpenShiftTimeoutRef.current = window.setTimeout(() => {
      setIsPreOpenShift(true);
    }, 430);

    unlockTimeoutRef.current = window.setTimeout(() => {
      pageFlip.flipNext();
      setIsCoverUnlocking(false);
    }, 900);
  };

  // trigger auto-open if shouldOpen is true (only once)
  useEffect(() => {
    if (shouldOpen && !hasAutoOpenedRef.current) {
      hasAutoOpenedRef.current = true;
      // small delay to ensure flipbook is mounted and ready
      const delayedOpen = window.setTimeout(() => {
        const pageFlip = bookRef.current?.pageFlip();
        runOpenSequence(pageFlip);
      }, 100);

      return () => window.clearTimeout(delayedOpen);
    }
  }, [shouldOpen]);

  // clean up timeouts
  useEffect(() => {
    return () => {
      if (preOpenShiftTimeoutRef.current) {
        window.clearTimeout(preOpenShiftTimeoutRef.current);
      }

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

  const handleOpenButtonClick = () => {
    if (currentPage !== 0 || isCoverUnlocking || isPreOpenShift) {
      return;
    }

    const pageFlip = bookRef.current?.pageFlip();

    if (!pageFlip) {
      return;
    }

    runOpenSequence(pageFlip);
  };

  return (
    <div className={styles.bookContainer}>
      <div className={`${styles.wrap} ${isPreOpenShift ? styles.preOpenShift : ''}`}>
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
                setIsPreOpenShift(false);
              }
            }}
            className={styles.flipBook}>
            {/* обложка + ремни + кнопка */}
            <Page
              className={`${styles.coverPage} ${isCoverUnlocking ? styles.coverUnlocking : ''}`}>
              <img
                src={belts}
                alt="Belts"
                className={`${styles.coverBelts} ${isBeltsHidden ? styles.coverBeltsHidden : ''}`}
              />
              <button
                type="button"
                className={styles.coverButton}
                onClick={handleOpenButtonClick}
                aria-label="Open book">
                <img src={button} alt="Open book" className={styles.coverButtonImage} />
              </button>
            </Page>

            {contentPages.map((page, index) => {
              const isSecondPage = index % 2 === 1;
              const isLeftPage = index % 2 === 0;
              const sketchIndex = Math.floor(index / 2) % sketches.length;

              return (
                <Page
                  key={`${page.title || 'page'}_${index}`}
                  onClick={handlePageClick}
                  className={`${isSecondPage ? styles.secondPage : ''} ${isLeftPage ? styles.leftPage : styles.rightPage}`}>
                  {isSecondPage ? (
                    <>
                      <img
                        src={cornerRight}
                        alt="Folded page corner right"
                        className={styles.cornerRight}
                      />
                      <img
                        src={sketches[sketchIndex]}
                        alt={`Sketch ${sketchIndex + 1}`}
                        className={styles.sketchImage}
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src={cornerLeft}
                        alt="Folded page corner"
                        className={styles.cornerLeft}
                      />
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

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HTMLFlipBook from 'react-pageflip';
import styles from './styles.module.css';
import wingedHussar from '../../assets/images/Winged_Hussar_opt.webp';
import cossackSerdyuk from '../../assets/images/Cossack_Serdyuk_opt.webp';
import Ottoman_Elite_Janissary from '../../assets/images/Ottoman_Elite_Janissary_opt.webp';
import belts from '../../assets/images/belts_opt.webp';
import background from '../../assets/images/background_book_opt.webp';
import button from '../../assets/images/button_old_opt.webp';
import cornerLeft from '../../assets/images/corner_left_opt.webp';
import cornerRight from '../../assets/images/corner_right_opt.webp';
import bookMark1 from '../../assets/images/book_mark_1_opt.webp';
import bookMark2 from '../../assets/images/book_mark_2_opt.webp';
import bookMark3 from '../../assets/images/book_mark_3_opt.webp';
import bookMark4 from '../../assets/images/book_mark_4_opt.webp';
import bookMark5 from '../../assets/images/book_mark_5_opt.webp';

// компонент страницы
const Page = forwardRef(function Page({ children, onClick, className = '' }, ref) {
  return (
    <div ref={ref} className={`${styles.page} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
});

function Book({ shouldOpen = false }) {
  const { t } = useTranslation();
  const bookRef = useRef(null);
  const preOpenShiftTimeoutRef = useRef(null);
  const unlockTimeoutRef = useRef(null);
  const beltsHideTimeoutRef = useRef(null);
  const hasAutoOpenedRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPreOpenShift, setIsPreOpenShift] = useState(false);
  const [isCoverUnlocking, setIsCoverUnlocking] = useState(false);
  const [isBeltsHidden, setIsBeltsHidden] = useState(false);

  // sections shown in the sidebar bookmarks. labels are now translated.
  const sections = [
    { label: t('bookmarks.intro'), page: 1, image: bookMark1 },
    { label: t('bookmarks.fractions'), page: 7, image: bookMark2 },
    { label: t('bookmarks.media'), page: 23, image: bookMark3 },
    { label: t('bookmarks.aboutProject'), page: 25, image: bookMark4 },
    { label: t('bookmarks.aboutUs'), page: 27, image: bookMark5 },
  ];

  const bookMarksText = [
    { title: t('bookmarks.intro') },
    { title: t('bookmarks.fractions') },
    { title: t('bookmarks.media') },
    { title: t('bookmarks.aboutProject') },
    { title: t('bookmarks.aboutUs') },
  ];

  const contentPages = [
    {
      type: 'text',
      title: t('pages.page1.title'),
      text: t('pages.page1.text'),
    },
    {
      type: 'image',
      image: wingedHussar,
      imageAlt: 'Winged Hussar',
    },
    {
      type: 'text',
      text: t('pages.page3.text'),
    },
    {
      type: 'text',
      text: t('pages.page4.text'),
    },
    {
      type: 'text',
      text: t('pages.page5.text'),
    },
    {
      type: 'blank',
    },
    {
      type: 'text',
      title: t('pages.page7.title'),
      subtitle: t('pages.page7.subtitle'),
      text: t('pages.page7.text'),
    },
    {
      type: 'image',
      image: cossackSerdyuk,
      imageAlt: 'Cossack Serdyuk',
    },
    {
      type: 'text',
      text: t('pages.page9.text'),
    },
    {
      type: 'blank',
    },
    {
      type: 'text',
      title: t('pages.page11.title'),
      subtitle: t('pages.page11.subtitle'),
      subtitle_2: t('pages.page11.subtitle_2'),
      text: t('pages.page11.text'),
    },
    {
      type: 'image',
      image: Ottoman_Elite_Janissary,
      imageAlt: 'Ottoman Elite Janissary',
    },
    {
      type: 'text',
      text: t('pages.page13.text'),
    },
    {
      type: 'text',
      text: t('pages.page14.text'),
    },
    {
      type: 'text',
      title: t('pages.page15.title'),
      subtitle: t('pages.page15.subtitle'),
      subtitle_2: t('pages.page15.subtitle_2'),
      text: t('pages.page15.text'),
    },
    {
      type: 'blank',
    },
    {
      type: 'text',
      text: t('pages.page17.text'),
    },
    {
      type: 'text',
      text: t('pages.page18.text'),
    },
    {
      type: 'text',
      title: t('pages.page19.title'),
      subtitle: t('pages.page19.subtitle'),
      subtitle_2: t('pages.page19.subtitle_2'),
      text: t('pages.page19.text'),
    },
    {
      type: 'blank',
    },
    {
      type: 'text',
      text: t('pages.page21.text'),
    },
    {
      type: 'text',
      text: t('pages.page22.text'),
    },
    {
      type: 'text',
      title: t('pages.page23.title'),
    },
    {
      type: 'video',
      videoSrc: '/videos/page24.mp4',
      videoType: 'video/mp4',
    },
    {
      type: 'text',
      title: t('pages.page25.title'),
    },
    {
      type: 'blank',
    },
    {
      type: 'text',
      title: t('pages.page27.title'),
    },
    {
      type: 'blank',
    },
  ];
  const totalPages = contentPages.length + 1;

  const runOpenSequence = useCallback(
    (pageFlip) => {
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
    },
    [isCoverUnlocking],
  );

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
  }, [runOpenSequence, shouldOpen]);

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

  // jump to a specific page via bookmark click
  const handleBookmarkClick = (page) => {
    const pageFlip = bookRef.current?.pageFlip();
    if (pageFlip) {
      pageFlip.flip(page);
    }
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
        {/* bookmarks sidebar attached to the book */}
        <div className={`${styles.bookmarks} ${currentPage > 0 ? styles.bookmarksOpen : ''}`}>
          {sections.map((sec, index) => {
            let isActive = currentPage === sec.page;
            const bookmarkLabel = bookMarksText[index]?.title || sec.label;

            if (index === 0) {
              isActive = currentPage >= 1 && currentPage < 7;
            } else if (index === 1) {
              isActive = currentPage >= 7 && currentPage < 23;
            } else if (index === 2) {
              isActive = currentPage >= 23 && currentPage < 24;
            } else if (index === 3) {
              isActive = currentPage >= 25 && currentPage < 26;
            } else if (index === 4) {
              isActive = currentPage >= 27;
            }

            return (
              <button
                key={sec.label}
                type="button"
                className={`${styles.bookmark} ${isActive ? styles.activeBookmark : ''}`}
                onClick={() => handleBookmarkClick(sec.page)}
                aria-label={t('ariaLabels.goToPage', { section: sec.label })}>
                <img src={sec.image} alt={sec.label} className={styles.bookmarkImage} />
                <span className={styles.bookmarkText}>{bookmarkLabel}</span>
              </button>
            );
          })}
        </div>
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
                aria-label={t('ariaLabels.openBook')}>
                <img src={button} alt="Open book" className={styles.coverButtonImage} />
              </button>
            </Page>

            {contentPages.map((page, index) => {
              const isLeftPage = index % 2 === 0;
              const isImagePage = page.type === 'image';
              const isBlankPage = page.type === 'blank';
              const isVideoPage = page.type === 'video';
              const isLastPage = index === contentPages.length - 1;
              const hasPage3Background = !isLeftPage;

              return (
                <Page
                  key={`${page.type || 'page'}_${index}`}
                  onClick={handlePageClick}
                  className={`${isImagePage ? styles.imagePage : ''} ${isVideoPage ? styles.videoPage : ''} ${hasPage3Background ? styles.secondPage : ''} ${isBlankPage ? styles.blankPage : ''} ${isLastPage ? styles.lastPage : ''} ${isLeftPage ? styles.leftPage : styles.rightPage}`}>
                  {isImagePage ? (
                    <>
                      <img
                        src={isLeftPage ? cornerLeft : cornerRight}
                        alt={isLeftPage ? 'Folded page corner left' : 'Folded page corner right'}
                        className={isLeftPage ? styles.cornerLeft : styles.cornerRight}
                      />
                      <img
                        src={page.image}
                        alt={page.imageAlt || 'Sketch'}
                        className={styles.sketchImage}
                      />
                    </>
                  ) : isVideoPage ? (
                    <>
                      <img
                        src={isLeftPage ? cornerLeft : cornerRight}
                        alt={isLeftPage ? 'Folded page corner left' : 'Folded page corner right'}
                        className={isLeftPage ? styles.cornerLeft : styles.cornerRight}
                      />
                      <div
                        className={styles.videoWrapper}
                        onClick={(event) => event.stopPropagation()}
                        onPointerDown={(event) => event.stopPropagation()}>
                        {page.title ? <h2 className={styles.title}>{page.title}</h2> : null}
                        <video
                          className={styles.videoPlayer}
                          controls
                          preload="metadata"
                          playsInline>
                          <source src={page.videoSrc} type={page.videoType || 'video/mp4'} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </>
                  ) : isBlankPage ? (
                    <img
                      src={isLeftPage ? cornerLeft : cornerRight}
                      alt={isLeftPage ? 'Folded page corner left' : 'Folded page corner right'}
                      className={isLeftPage ? styles.cornerLeft : styles.cornerRight}
                    />
                  ) : (
                    <>
                      <img
                        src={isLeftPage ? cornerLeft : cornerRight}
                        alt={isLeftPage ? 'Folded page corner left' : 'Folded page corner right'}
                        className={isLeftPage ? styles.cornerLeft : styles.cornerRight}
                      />
                      {page.title ? <h2 className={styles.title}>{page.title}</h2> : null}
                      {page.subtitle ? <p className={styles.subtitle}>{page.subtitle}</p> : null}
                      {page.subtitle_2 ? (
                        <p className={styles.subtitle}>{page.subtitle_2}</p>
                      ) : null}
                      {page.text ? <p className={styles.text}>{page.text}</p> : null}
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

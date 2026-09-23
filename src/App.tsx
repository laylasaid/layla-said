import { useEffect, useState } from 'react';
import { DnaBackground } from './components/DnaBackground';
import { TileCanvas } from './components/TileCanvas';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { portfolioData } from './data/portfolioData';

const PALETTE_VARS: Record<string, Record<string, string>> = {
  'neon-lime': { '--lime': '#c8ff00', '--ink': '#0e0e0e', '--cream': '#f0ede4', '--dim': '#7a7a6e', '--ink-2': '#1a1a1a' },
  'cyber-blue': { '--lime': '#00d4ff', '--ink': '#060d1a', '--cream': '#e0f4ff', '--dim': '#4a7a8a', '--ink-2': '#0d1a2e' },
  'rose-gold': { '--lime': '#f4a9b8', '--ink': '#0f0a0d', '--cream': '#ffe8ed', '--dim': '#7a5060', '--ink-2': '#1e0f15' },
  'aurora':    { '--lime': '#7fffb2', '--ink': '#060f0a', '--cream': '#e0fff0', '--dim': '#3a6a55', '--ink-2': '#0d1e15' },
};

export default function App() {
  const [eyebrowIn, setEyebrowIn] = useState(false);
  const [word1In, setWord1In] = useState(false);
  const [word2In, setWord2In] = useState(false);
  const [bottomIn, setBottomIn] = useState(false);
  const [photoIn, setPhotoIn] = useState(false);

  useEffect(() => {
    // Apply palette CSS variables to :root
    const palette = portfolioData.colorPalette || 'neon-lime';
    const vars = PALETTE_VARS[palette] || PALETTE_VARS['neon-lime'];
    Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    if (portfolioData.customAccentColor) {
      document.documentElement.style.setProperty('--lime', portfolioData.customAccentColor);
    }

    const t0 = setTimeout(() => setEyebrowIn(true), 2100);
    const t1 = setTimeout(() => setWord1In(true), 2250);
    const t2 = setTimeout(() => setWord2In(true), 2400);
    const t3 = setTimeout(() => setBottomIn(true), 2700);
    const t4 = setTimeout(() => setPhotoIn(true), 2500);
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in-view'); }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
    );
    reveals.forEach((el) => observer.observe(el));
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); observer.disconnect(); };
  }, []);

  const scrollTo = (id: string) => {
    if (id === 'hero' || id === 'portfolio-hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(id) || document.getElementById('section-' + id);
    if (!target) return;
    const navHeight = 90;
    const topPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
    window.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
  };

  const { personal, navigation, marquee, expertiseHeader, expertise, projectsHeader, projects, about, timeline, contact, footer, backgroundAnimation, customSections } = portfolioData;

  const isCenter = personal.photoPosition === 'center';
  const isLeft = personal.photoPosition === 'left';

  return (
    <main className="relative w-full overflow-x-hidden" style={{ background: 'var(--ink)' }}>
      <div id="grain" aria-hidden="true" />
      <CustomCursor />
      <Preloader />
      <DnaBackground
        type={(backgroundAnimation as any) || 'dna'}
        accentColor={portfolioData.customAccentColor || (portfolioData.colorPalette === 'cyber-blue' ? '#00d4ff' : portfolioData.colorPalette === 'rose-gold' ? '#f4a9b8' : portfolioData.colorPalette === 'aurora' ? '#7fffb2' : '#c8ff00')}
      />
      <nav id="nav" aria-label="Primary navigation">
        <div className="nav-logo" onClick={() => scrollTo('hero')}>{personal.logoText}<span>.</span></div>
        <ul className="nav-links">
          {navigation.map((item) => (
            <li key={item.targetId}><button type="button" onClick={() => scrollTo(item.targetId)}>{item.label}</button></li>
          ))}
        </ul>
        <div className="nav-avail"><span className="avail-dot" />{personal.availabilityText}</div>
      </nav>
      <div className="relative z-10">
        <section
          id="hero"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            minHeight: '100vh',
            padding: '8.5rem 5vw 3.5rem',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
          <div
            className="hero-content"
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              display: 'flex',
              flexDirection: isCenter ? 'column' : isLeft ? 'row-reverse' : 'row',
              justifyContent: isCenter ? 'center' : 'space-between',
              alignItems: isCenter ? 'center' : 'flex-end',
              textAlign: isCenter ? 'center' : 'left',
              gap: '2.5rem',
            }}
          >
            {isCenter && personal.photoUrl && (
              <div
                className="hero-avatar-wrap"
                style={{
                  opacity: photoIn ? 1 : 0,
                  transform: photoIn ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(30px)',
                  filter: photoIn ? 'blur(0px)' : 'blur(8px)',
                  transition: 'opacity 0.9s ease, transform 1s cubic-bezier(0.16,1,0.3,1), filter 0.9s ease',
                  flexShrink: 0,
                  margin: '0 auto 1.5rem',
                }}
              >
                <div style={{ width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid rgba(200,255,0,0.4)', boxShadow: '0 0 0 1px rgba(200,255,0,0.25), 0 20px 60px rgba(0,0,0,0.6)', position: 'relative' }}>
                  <img src={personal.photoUrl} alt={personal.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.05) saturate(0.9)' }} />
                </div>
                <div style={{ marginTop: '0.6rem', fontFamily: 'var(--f-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lime)', textAlign: 'center' }}>{personal.role}</div>
              </div>
            )}

            <div
              style={{
                flex: isCenter ? 'none' : 1,
                width: isCenter ? '100%' : 'auto',
                maxWidth: isCenter ? '850px' : 'none',
              }}
            >
              <div
                className="hero-eyebrow"
                style={{
                  opacity: eyebrowIn ? 1 : 0,
                  transition: 'opacity 1s ease',
                  display: 'flex',
                  justifyContent: isCenter ? 'center' : 'space-between',
                  gap: isCenter ? '2.5rem' : '0',
                }}
              >
                <span>{personal.tagline}</span><span>{personal.education}</span>
              </div>
              <h1 className="hero-main">
                <span className="line"><span className="word" style={{ transform: word1In ? 'translateY(0)' : 'translateY(115%)' }}>{personal.firstName}</span></span>
                <span className="line"><span className="word accent" style={{ transform: word2In ? 'translateY(0)' : 'translateY(115%)' }}>{personal.lastName}</span></span>
              </h1>
              <div className="hero-bottom" style={{ opacity: bottomIn ? 1 : 0, transform: bottomIn ? 'translateY(0)' : 'translateY(20px)' }}>
                <p className="hero-sub">{personal.heroSubTextLine1}<br />{personal.heroSubTextLine2}</p>
                <div className="hero-cta" style={{ justifyContent: isCenter ? 'center' : 'flex-start' }}>
                  <button type="button" className="btn-primary" onClick={() => scrollTo('projects')}>{personal.primaryCtaText}</button>
                  <button type="button" className="btn-ghost" onClick={() => scrollTo('contact')}>{personal.secondaryCtaText}</button>
                  {personal.cvUrl && (
                    <a
                      href={personal.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download="Resume.pdf"
                      className="btn-ghost"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        borderColor: 'rgba(200, 255, 0, 0.4)',
                        color: 'var(--lime)',
                        textDecoration: 'none',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Download Resume
                    </a>
                  )}
                </div>
                <div className="hero-scroll"><div className="scroll-line" />{personal.scrollText}</div>
              </div>
            </div>

            {!isCenter && personal.photoUrl && (
              <div
                className="hero-avatar-wrap"
                style={{
                  opacity: photoIn ? 1 : 0,
                  transform: photoIn ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(30px)',
                  filter: photoIn ? 'blur(0px)' : 'blur(8px)',
                  transition: 'opacity 0.9s ease, transform 1s cubic-bezier(0.16,1,0.3,1), filter 0.9s ease',
                  flexShrink: 0,
                }}
              >
                <div style={{ width: '220px', height: '270px', borderRadius: '4px', overflow: 'hidden', border: '1.5px solid rgba(200,255,0,0.4)', boxShadow: '0 0 0 1px rgba(200,255,0,0.25), 0 20px 60px rgba(0,0,0,0.6)', position: 'relative' }}>
                  <img src={personal.photoUrl} alt={personal.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.05) saturate(0.9)' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'linear-gradient(90deg, var(--lime), transparent)' }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '3px', height: '100%', background: 'linear-gradient(180deg, transparent, var(--lime))' }} />
                </div>
                <div style={{ marginTop: '0.6rem', fontFamily: 'var(--f-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lime)', textAlign: 'center' }}>{personal.role}</div>
              </div>
            )}
          </div>
        </section>

        <div className="marquee-wrap">
          <div className="marquee-inner">
            {marquee.map((item, idx) => (
              <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '2.5rem' }}>
                <span>{item}</span><span className="sep">✦</span>
              </span>
            ))}
          </div>
        </div>

        <section id="tiles">
          <div className="tiles-header reveal">
            <h2 className="tiles-title">{expertiseHeader.titleMain}<br /><span>{expertiseHeader.titleAccent}</span></h2>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--dim)' }}>{expertiseHeader.badge}</span>
          </div>
          <div className="tiles-grid">
            {expertise.map((tile) => (
              <div className="tile reveal" key={tile.id}>
                <div className="tile-glow" />
                <TileCanvas id={tile.id} type={tile.type as any} className="tile-canvas" />
                <div className="tile-num">{tile.num} —</div>
                <div className="tile-name">{tile.name}</div>
                <div className="tile-desc">{tile.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects">
          <div className="projects-header reveal">
            <h2 className="projects-title">{projectsHeader.titleMain}<br /><span>{projectsHeader.titleAccent}</span></h2>
          </div>
          {projects.map((project) => (
            <div className="project-card reveal" key={project.id} style={project.flip ? { direction: 'rtl' } : {}}>
              <div className="project-canvas-wrap" style={project.flip ? { direction: 'ltr' } : {}}>
                {project.img ? (
                  <img src={project.img} alt="project cover" className="project-img" loading="lazy" />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dim)', fontFamily: 'var(--f-mono)', fontSize: '0.8rem' }}>No image</div>
                )}
                <div className="proj-overlay-reveal" style={project.flip ? { transformOrigin: 'right' } : {}} />
              </div>
              <div className="project-info" style={project.flip ? { direction: 'ltr', borderLeft: 'none', borderRight: '1px solid var(--line)' } : {}}>
                <div>
                  <div className="proj-meta"><span className="proj-num">{project.num}</span><span className="proj-cat">{project.cat}</span></div>
                  <h3 className="proj-title">
                    {project.titlePrefix}
                    {project.titleSuffix && project.titleHighlight ? (
                      <><em>{project.titleHighlight}</em><br />{project.titleSuffix}</>
                    ) : (
                      <><br /><em>{project.titleHighlight}</em></>
                    )}
                  </h3>
                  <p className="proj-desc">{project.desc}</p>
                  <div className="proj-tech">{project.tech.map((t) => <span className="tech-tag" key={t}>{t}</span>)}</div>
                </div>
                <a href={project.link} className="proj-link" target={project.link === '#' ? undefined : '_blank'} rel="noreferrer">View Project ↗</a>
              </div>
            </div>
          ))}
        </section>

        <section id="about">
          <div className="about-grid">
            <div className="about-statement reveal">
              {about.statementLine1}<br /><em>{about.statementHighlight}</em><br />{about.statementLine2}<br />{about.statementLine3}
            </div>
            <div className="about-right">
              <div className="about-bio reveal">
                {about.paragraphs.map((para, i) => <p key={i} style={{ marginBottom: i < about.paragraphs.length - 1 ? '1.5rem' : 0 }}>{para}</p>)}
              </div>
              <div className="about-stats">
                {about.stats.map((s) => (
                  <div className="stat reveal" key={s.l}><div className="stat-n">{s.n}</div><div className="stat-l">{s.l}</div></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="experience">
          <div className="exp-header reveal">
            <h2 className="section-title">{timeline.titleMain}<br /><span>{timeline.titleAccent}</span></h2>
          </div>
          <div className="exp-grid">
            <div>
              <div className="exp-col-title">{timeline.trainingColumnTitle}</div>
              {timeline.training.map((item) => (
                <div className="exp-item reveal" key={item.title}>
                  <div className={`exp-dot${item.active ? '' : ' dim'}`} />
                  <div className="exp-title">{item.title}</div>
                  <div className="exp-org">{item.org}</div>
                  <div className="exp-desc">{item.desc}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="exp-col-title">{timeline.hackathonsColumnTitle}</div>
              {timeline.hackathons.map((item) => (
                <div className="hack-card reveal" key={item.name}>
                  <div className="hack-name">{item.name}</div>
                  <div className="hack-date">{item.date}</div>
                  <div className="hack-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {(customSections || []).filter((s: any) => s.visible !== false).map((section: any) => (
          <section id={'section-' + (section.id || section.type)} key={section.id || section.type} className="reveal" style={{ borderTop: '1px solid var(--line)', padding: '6rem 5vw' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--lime)', display: 'block', marginBottom: '0.5rem' }}>
                  // {section.type}
                </span>
                <h2 className="section-title" style={{ margin: 0 }}>{section.title || section.type}</h2>
              </div>
            </div>

            {section.type === 'testimonials' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {(section.items || []).map((item: any, i: number) => (
                  <div key={item.id || i} className="custom-card-anim" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(240,237,228,0.12)', borderRadius: '16px', padding: '2.5rem 2rem 2rem', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
                    <div className="cyber-shimmer-bar" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'linear-gradient(90deg, transparent, var(--lime), transparent)', opacity: 0 }} />
                    <div style={{ color: 'var(--lime)', fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '2px' }}>★★★★★</div>
                    <p style={{ fontFamily: 'var(--f-body)', fontSize: '1rem', lineHeight: 1.65, color: 'var(--cream)', fontStyle: 'italic', marginBottom: '1.75rem' }}>
                      "{item.body || item.heading}"
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', borderTop: '1px solid rgba(240,237,228,0.08)', paddingTop: '1.25rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(200,255,0,0.12)', border: '1px solid var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lime)', fontFamily: 'var(--f-mono)', fontWeight: 700, fontSize: '0.8rem' }}>
                        {(item.heading || 'C').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--cream)' }}>{item.heading}</div>
                        <div style={{ fontFamily: 'var(--f-mono)', fontSize: '0.72rem', color: 'var(--dim)' }}>{item.subheading}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'services' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
                {(section.items || []).map((item: any, i: number) => (
                  <div key={item.id || i} className="custom-card-anim" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,237,228,0.1)', borderRadius: '12px', padding: '2.25rem 2rem', position: 'relative', overflow: 'hidden' }}>
                    <div className="cyber-shimmer-bar" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'linear-gradient(90deg, var(--lime), transparent)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.65rem', color: 'var(--lime)' }}>0{i + 1} // CAPABILITY</span>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.65rem', color: 'var(--dim)' }}>{item.subheading}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--cream)', marginBottom: '1rem' }}>{item.heading}</h3>
                    <p style={{ fontFamily: 'var(--f-body)', fontSize: '0.88rem', color: 'var(--dim)', lineHeight: 1.65 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'awards' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {(section.items || []).map((item: any, i: number) => (
                  <div key={item.id || i} className="custom-card-anim" style={{ background: 'linear-gradient(145deg, rgba(200,255,0,0.04) 0%, rgba(0,0,0,0.4) 100%)', border: '1px solid rgba(200,255,0,0.2)', borderRadius: '14px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                    <div className="cyber-shimmer-bar" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'linear-gradient(90deg, transparent, var(--lime), transparent)', opacity: 0 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                      <span className="trophy-badge-float" style={{ color: 'var(--lime)', fontSize: '1.4rem' }}>🏆</span>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.7rem', color: 'var(--lime)', background: 'rgba(200,255,0,0.1)', padding: '3px 8px', borderRadius: '6px' }}>{item.subheading || '2025'}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--cream)', marginBottom: '0.6rem' }}>{item.heading}</h3>
                    <p style={{ fontFamily: 'var(--f-body)', fontSize: '0.85rem', color: 'var(--dim)', lineHeight: 1.55 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'publications' && (
              <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid rgba(240,237,228,0.12)' }}>
                {(section.items || []).map((item: any, i: number) => (
                  <div key={item.id || i} className="custom-card-anim" style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 180px) 1fr auto', gap: '2rem', alignItems: 'center', padding: '2rem 1rem', borderBottom: '1px solid rgba(240,237,228,0.08)' }}>
                    <div>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.68rem', color: 'var(--lime)', display: 'block' }}>[PUB — 0{i + 1}]</span>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: '0.78rem', color: 'var(--dim)' }}>{item.subheading}</span>
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--cream)', marginBottom: '0.4rem' }}>{item.heading}</h3>
                      <p style={{ fontFamily: 'var(--f-body)', fontSize: '0.85rem', color: 'var(--dim)', margin: 0 }}>{item.body}</p>
                    </div>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', borderRadius: '999px', border: '1px solid rgba(240,237,228,0.15)', color: 'var(--lime)', fontFamily: 'var(--f-mono)', fontSize: '0.75rem', textDecoration: 'none' }}>
                        Read ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {section.type === 'hobbies' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {(section.items || []).map((item: any, i: number) => (
                  <div key={item.id || i} className="custom-card-anim" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(240,237,228,0.1)', borderRadius: '14px', padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
                    <div className="cyber-shimmer-bar" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'linear-gradient(90deg, transparent, var(--lime), transparent)', opacity: 0 }} />
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: '0.65rem', color: 'var(--dim)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{item.subheading || 'Passion'}</div>
                    <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--cream)', marginBottom: '0.5rem' }}>{item.heading}</h3>
                    <p style={{ fontFamily: 'var(--f-body)', fontSize: '0.82rem', color: 'var(--dim)', lineHeight: 1.55 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            )}

            {section.type === 'custom' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {(section.items || []).map((item: any, i: number) => (
                  <div key={item.id || i} className="custom-card-anim" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(240,237,228,0.1)', borderRadius: '12px', minHeight: 'unset', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', position: 'relative', overflow: 'hidden' }}>
                    <div className="cyber-shimmer-bar" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', background: 'linear-gradient(90deg, transparent, var(--lime), transparent)', opacity: 0 }} />
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: '0.65rem', color: 'var(--lime)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{String(i + 1).padStart(2, '0')} —</div>
                    {item.heading && <div style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--cream)', lineHeight: 1.25 }}>{item.heading}</div>}
                    {item.subheading && <div style={{ fontFamily: 'var(--f-mono)', fontSize: '0.75rem', color: 'var(--lime)', letterSpacing: '0.08em' }}>{item.subheading}</div>}
                    {item.body && <p style={{ fontFamily: 'var(--f-body)', fontSize: '0.85rem', color: 'var(--dim)', lineHeight: 1.6, margin: 0 }}>{item.body}</p>}
                    {item.url && <a href={item.url} target="_blank" rel="noreferrer" style={{ marginTop: 'auto', fontFamily: 'var(--f-mono)', fontSize: '0.72rem', color: 'var(--lime)', letterSpacing: '0.08em', textTransform: 'uppercase', paddingTop: '0.75rem', borderTop: '1px solid var(--line)', display: 'inline-block' }}>View ↗</a>}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        <section id="contact">
          <p className="contact-label">{contact.label}</p>
          <h2 className="contact-big reveal">{contact.headingLine1}<br /><em>{contact.headingHighlight}</em><br />{contact.headingLine2}</h2>
          <div className="contact-row">
            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contact.email)}`} target="_blank" rel="noreferrer" className="email-link">{contact.email}</a>
            <div className="contact-socials">
              {contact.socials.map((social) => (
                <a key={social.label} href={social.url} target="_blank" rel="noreferrer" className="social-link" download={social.isDownload ? true : undefined}>{social.label}</a>
              ))}
            </div>
          </div>
        </section>

        <footer>
          <span className="footer-l">© {new Date().getFullYear()} {footer.author}</span>
          <span className="footer-logo">{footer.logo}</span>
          <span className="footer-r">{footer.credit}</span>
        </footer>
      </div>
    </main>
  );
}

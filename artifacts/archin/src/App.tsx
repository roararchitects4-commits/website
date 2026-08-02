import React from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { PageTransition } from './components/PageTransition';
import { CustomCursor } from './components/CustomCursor';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Statement } from './components/Statement';
import { LineDivider } from './components/LineDivider';
import { DrawingBoard } from './components/DrawingBoard';
import { WorkGrid } from './components/WorkGrid';
import { ServiceCards } from './components/ServiceCards';
import { Clients } from './components/Clients';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

function Home() {
  return (
    <div className="relative bg-background">
      <CustomCursor />
      <PageTransition />
      <Header />
      
      <main>
        <Hero />
        
        <About />
        
        <Statement 
          quote={<>We design buildings that belong to their site and their climate — creating timeless spaces that remain as relevant in fifty years as on the day of handover.</>}
        />
        
        <LineDivider />
        
        <DrawingBoard />
        
        <WorkGrid />
        
        <Statement 
          kicker="Our Philosophy"
          quote={<>Architecture is not about form, but about the life that happens within it.</>}
        />
        
        <ServiceCards />
        
        <Clients />
        
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route>
        {/* 404 minimal fallback */}
        <div className="min-h-screen flex items-center justify-center bg-background text-ink">
          <div className="text-center">
            <h1 className="font-serif text-4xl mb-4">404</h1>
            <a href="/" className="text-[11px] tracking-[0.2em] border-b border-accent pb-1">RETURN HOME</a>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
    </WouterRouter>
  );
}

export default App;

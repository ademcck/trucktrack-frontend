import AppComponent from '@/components/app/AppComponent';
import HeaderComponent from '@/components/template-container/HeaderComponent';


export default function Home() {
  return (
    <div className='w-full h-full'>
      <HeaderComponent />
      <AppComponent />
    </div>
  );
}

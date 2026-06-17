import Link from 'next/link'
import Head from 'next/head'
import Header from '../components/Header'
import ModeCard from '../components/ModeCard'

export default function Home() {
  return (
    <div>
      <Head>
        <title>AI 视频制作</title>
      </Head>
      <Header />
      <main className="container">
        <h2 className="title">选择创作模式</h2>
        <div className="modes">
          <Link href="/create/image">
            <ModeCard title="图片轮播模式" desc="AI 生成图片，轮播成片" />
          </Link>
          <Link href="/create/html">
            <ModeCard title="HTML 视频模式" desc="AI 生成网页动画，导出视频" />
          </Link>
        </div>
      </main>
    </div>
  )
}

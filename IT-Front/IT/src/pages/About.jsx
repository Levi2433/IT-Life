
import React, { useState } from 'react'
import "../index.css"
import "../pages/About.css"
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Img from "../assets/img.png"
import Img2 from "../assets/img2.png"
import Img3 from "../assets/img3.png"
import Img4 from "../assets/img4.png"
import Img5 from "../assets/img5.png"
import Sertificate1 from "../assets/sertificate.png"
import Sertificate2 from "../assets/sertificate2.png"
import TeacherPic from './MentorPic'
import MentorPic from './MentorPic'

const galleryImages = [
  { id: 1, src: Img, alt: "Gallery 1" },
  { id: 2, src: Img2, alt: "Gallery 2" },
  { id: 3, src: Img3, alt: "Gallery 3" },
  { id: 4, src: Img4, alt: "Gallery 4" },
  { id: 5, src: Img5, alt: "Gallery 5" },
]

const certPages = Array.from({ length: 10 }, () => [
  Sertificate1,
  Sertificate1,
  Sertificate2,
  Sertificate2,
])

const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 3 || current >= total - 2) {
    return [1, 2, 3, "...", total - 2, total - 1, total]
  }
  return [1, "...", current - 1, current, current + 1, "...", total]
}

const About = () => {
  const [page, setPage] = useState(1)
  const [touchStart, setTouchStart] = useState(null)
  const total = certPages.length

  const goTo = (n) => {
    if (n < 1 || n > total) return
    setPage(n)
  }

  const handleTouchEnd = (e) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) goTo(diff > 0 ? page + 1 : page - 1)
    setTouchStart(null)
  }

  return (
    <>
      <Navbar />
      <section className="about">
        <div className="container">
          <h1 className="about__title">Biz haqimizda</h1>

          <div className="about__text">
            <p>
              Lorem ipsum dolor sit amet consectetur. Eget elementum habitant
              congue. Commodo id mattis dignissim justo adipiscing odio quisque
              ut. Urna tellus sit eu posuere neque. Posuere eget dictum turpis
              iaculis massa. Arcu pharetra sed tellus habitant tincidunt. Proin
              neque aliquet at sed a sed sed. Vestibulum mi pellentesque quis id
              ac ullamcorper fusce nisi. Vitae consequat mauris tempor sed vitae
              ornare urna lorem sit. Eget tristique lacus arcu maecenas ac
              dolor vitae in ut. Malesuada morbi ultrices diam morbi vulputate
              odio purus. Placerat aliquam at risus at elementum.
            </p>
            <p>
              Etiam commodo in cursus erat in turpis eget sapien tincidunt.
              Cras arcu egestas eu metus venenatis et posuere erat porta. Amet
              nunc donec dignissim ornare tortor quis lectus. Morbi ut rutrum
              ultrices pulvinar at. Pharetra viverra enim tristique etiam.
            </p>
            <p>
              Vulputate nisi maecenas lorem leo consectetur vulputate
              consequat. Bibendum at at ultrices mauris risus fames. Mauris sit
              et et malesuada commodo nibh gravida. Commodo accumsan varius dui
              odio pharetra dictum sem. Egestas nisi vestibulum.
            </p>
          </div>

          <h2 className="about__subtitle">Media galereya</h2>

          <div className="about__gallery">
            {galleryImages.map((img) => (
              <div className={`about__gallery-item item-${img.id}`} key={img.id}>
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>

          {/* Sertifikat va guvohnomalar — karusel */}
          <div className="certs">
            <div className="certs__pagination">
              <button
                className="certs__nav"
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
              >
                <ArrowLeft size={16} />
                <span>Ortga</span>
              </button>

              <div className="certs__numbers">
                {getPageNumbers(page, total).map((n, i) =>
                  n === "..." ? (
                    <span className="certs__dots" key={`dots-${i}`}>...</span>
                  ) : (
                    <button
                      key={n}
                      className={`certs__num ${page === n ? "active" : ""}`}
                      onClick={() => goTo(n)}
                    >
                      {n}
                    </button>
                  )
                )}
              </div>

              <button
                className="certs__nav"
                onClick={() => goTo(page + 1)}
                disabled={page === total}
              >
                <span>Keyingi</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <h2 className="about__subtitle certs__title">Sertifikat va guvohnomalar</h2>

            <div
              className="certs__viewport"
              onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="certs__track"
                style={{ transform: `translateX(-${(page - 1) * 100}%)` }}
              >
                {certPages.map((imgs, idx) => (
                  <div className="certs__slide" key={idx}>
                    <div className="certs__grid">
                      <div className="certs__card card-1">
                        <img src={imgs[0]} alt="Sertifikat 1" />
                      </div>
                      <div className="certs__card card-2">
                        <img src={imgs[1]} alt="Sertifikat 2" />
                      </div>
                      <div className="certs__card card-3">
                        <img src={imgs[2]} alt="Sertifikat 3" />
                      </div>
                      <div className="certs__card card-4">
                        <img src={imgs[3]} alt="Sertifikat 4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <MentorPic />
        </div>
      </section>
      <Footer />
    </>
  )
}

export default About
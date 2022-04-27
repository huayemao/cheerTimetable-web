import 'css-doodle'
import { memo } from 'react'

const HeroDoodle = ({ seed }) => {
  return (
    <div
      className="h-32 w-64 overflow-hidden border border-slate-50  md:h-48 md:w-96"
      dangerouslySetInnerHTML={{
        __html: `<css-doodle seed="${seed}" class="doodle">
            :doodle {
              @grid: 10 / 40em;
              grid-gap: .4em;
            }

            :doodle(:hover) {--h:running;}
           
            --hue: calc(217 + .5 * @row() * @col());
            --hue1: calc(217 + .5 * (@row()-1) * (@col()+1));
            background: hsla(var(--hue), 91%, 50%, @r(.1, .9));
            clip-path: ellipse(100% 100% at @pick('0 0', '0 100%', '100% 0', '100% 100%'));

            animation: blink 8s infinite;
            // animation-play-state:var(--h,paused);
            // animation-delay: @rand(50ms);

            @keyframes blink {
              0% {
                background: hsla(var(--hue1), 91%, 50%, @r(.1, .9));
              }
              33% {
                background: hsla(var(--hue), 91%, 50%, @r(.1, .9));
              }
              66% {
                background: hsla(var(--hue1), 91%, 50%, @r(.1, .9));
              }
            }

           </css-doodle>`,
      }}
    />
  )
}

export default memo(HeroDoodle)

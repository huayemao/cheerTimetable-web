import 'css-doodle'

const HeroDoodle = ({ seed }) => {
  return (
    <div
      className="h-32 w-64 overflow-hidden border border-slate-50  md:h-48 md:w-96"
      dangerouslySetInnerHTML={{
        __html: `<css-doodle seed="${seed}" click-to-update class="doodle">
            :doodle {
           @grid: 10 / 40em;
           grid-gap: .4em;
            }
           
           --hue: calc(217 + .5 * @row() * @col());
               background: hsla(var(--hue), 91%, 50%, @r(.1, .9));
           clip-path: ellipse(100% 100% at @pick('0 0', '0 100%', '100% 0', '100% 100%'));
           </css-doodle>`,
      }}
    />
  )
}

export default HeroDoodle

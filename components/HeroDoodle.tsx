import 'css-doodle'

export function HeroDoodle({ active }) {
  return (
    <div
      className="h-32 w-64 overflow-hidden border border-slate-50  lg:h-48 lg:w-96"
      dangerouslySetInnerHTML={{
        __html: `<css-doodle seed="${active}" click-to-update class="doodle">
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

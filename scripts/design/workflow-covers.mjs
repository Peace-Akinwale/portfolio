import fs from 'node:fs/promises';
import sharp from 'sharp';
const escape = s => s.replaceAll('&','&amp;');
const text=(x,y,s,size=24,color='#10222f',font='Arial')=>`<text x="${x}" y="${y}" fill="${color}" font-family="${font}" font-size="${size}">${escape(s)}</text>`;
const box=(x,y,w,h,fill='#f5f8fa',stroke='#aac0cd')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}"/>`;
const arrow=(x,y,x2,y2)=>`<path d="M${x} ${y} H${(x+x2)/2} V${y2} H${x2}" fill="none" stroke="#567b91" stroke-width="2" marker-end="url(#arrow)"/>`;
const base=(label,title,sub,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="none" stroke="#567b91"/></marker></defs><rect width="1200" height="630" fill="#d9e5ec"/>${text(54,52,label,17,'#426176')}${text(54,120,title,48,'#10222f','Georgia')}${text(54,162,sub,21,'#426176')}${body}<path d="M54 565H1146" stroke="#aac0cd"/>${text(54,601,'Peace Akinwale',20,'#10222f','Georgia')}${text(895,601,'WORKFLOW OVERVIEW',14,'#426176')}</svg>`;
const reading = base('AI WORKFLOWS · STEVE TOTH','Read the industry. Follow the changes.','A reading workspace and documentation monitor for an AEO team.',
 box(54,208,515,322)+box(601,208,545,322)+
 text(78,246,'01  INDUSTRY READING',16,'#426176')+
 ['LinkedIn + X','YouTube + blogs'].map((s,i)=>box(78,278+i*64,184,48,'#e7eff4')+text(92,309+i*64,s,19)).join('')+
 arrow(264,333,310,333)+box(317,278,226,154,'#10222f','#10222f')+text(337,312,'One reading workspace',18,'#fff')+text(337,352,'Read relevant posts',18,'#d9e5ec')+text(337,388,'Save and return to them',18,'#d9e5ec')+
 text(78,492,'Fewer feeds to check throughout the day.',20)+
 text(625,246,'02  DOCUMENTATION CHANGES',16,'#426176')+
 box(625,278,225,94,'#e7eff4')+text(643,312,'Previous wording',20)+`<path d="M644 338H823 M644 351H792" stroke="#a9bcc8" stroke-width="5"/>`+
 box(875,278,246,94,'#e7eff4')+text(894,312,'Updated wording',20)+`<path d="M894 338H1093 M894 351H1060" stroke="#567b91" stroke-width="5"/>`+
 text(625,412,'Compare the source.',26,'#10222f','Georgia')+text(625,449,'Decide what affects the team’s work.',20)+text(625,492,'Keep the evidence beside the explanation.',20));
const fanout=base('AI SEARCH ANALYSIS · STEVE TOTH','Look behind the AI answer.','Follow available search queries, cited sources and brand mentions.',
 box(54,292,206,136,'#10222f','#10222f')+text(76,332,'A buyer’s question',22,'#fff','Georgia')+text(76,369,'Prompt an AI',19,'#d9e5ec')+text(76,398,'search platform',19,'#d9e5ec')+
 arrow(260,360,318,360)+
 [0,1,2].map((v)=>box(326,237+v*88,230,64)+text(346,276+v*88,['Search query','Related query','Follow-up query'][v],22)).join('')+
 arrow(556,269,618,300)+arrow(556,357,618,357)+arrow(556,445,618,414)+box(626,265,236,190)+text(650,304,'Cited sources',25,'#10222f','Georgia')+text(650,346,'Product websites',20)+text(650,381,'Publisher articles',20)+text(650,416,'Supporting pages',20)+arrow(862,360,914,360)+
 box(922,265,224,190,'#10222f','#10222f')+text(944,304,'Brand mentions',24,'#fff','Georgia')+text(944,346,'Who appears?',20,'#d9e5ec')+text(944,381,'Who is missing?',20,'#d9e5ec')+text(944,416,'What to investigate?',18,'#d9e5ec')+
 text(326,514,'Recorded activity → sources to inspect → questions to investigate',21,'#426176'));
await fs.mkdir('public/og',{recursive:true});
for(const [key,svg] of [['seo-aeo-research-workflows',reading],['fanout-query-analysis-tool',fanout]]) {
 const stem=`public/og/case-study-${key}`;
 await fs.writeFile(stem+'.svg',svg);
 await sharp(Buffer.from(svg)).png().toFile(stem+'.png');
}

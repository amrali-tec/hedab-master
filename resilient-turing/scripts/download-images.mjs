import fs from 'fs';
import path from 'path';
import https from 'https';

const projectImages = [
  {
    filename: 'project-1.jpg',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80', // Serene landscape / stone cemetery pathways in arid climate
    desc: 'تشغيل وصيانة مقابر المسلمين بمدينة الرياض'
  },
  {
    filename: 'project-2.jpg',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80', // Asphalt paving machine laying fresh black asphalt
    desc: 'صيانة الشوارع نطاق بلدية شرق بريدة'
  },
  {
    filename: 'project-3.jpg',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80', // Heavy machinery clearing debris from open land
    desc: 'معالجة بلاغات 940 والتشوهات البصرية شمال مدينة بريدة'
  },
  {
    filename: 'project-4.jpg',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80', // Water and sewage pipeline & storage infrastructure
    desc: 'إعادة تهيئة خزانات مياه الصرف الصحي والشروب والسيول بالشؤون الصحية'
  },
  {
    filename: 'project-5.jpg',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80', // Government municipal building and facilities
    desc: 'تشغيل وصيانة مباني ومرافق بلدية محافظة الخرج'
  },
  {
    filename: 'project-6.jpg',
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80', // Landscaped cemetery grounds with stone path
    desc: 'تشغيل وصيانة مقبرة غير المسلمين بمدينة الرياض'
  },
  {
    filename: 'project-7.jpg',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80', // Highway maintenance and road clearing crew
    desc: 'إزالة عناصر التشوه البصري بالمحاور الرئيسية بمدينة الرياض'
  },
  {
    filename: 'project-8.jpg',
    url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80', // Stormwater drainage trench and concrete culverts
    desc: 'صيانة وتشغيل شبكات تصريف السيول (بلدية العزيزية)'
  },
  {
    filename: 'project-9.jpg',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80', // Stormwater pump station and flood control canal
    desc: 'صيانة وتشغيل شبكات تصريف السيول (بلدية الشفا والحائر)'
  },
  {
    filename: 'project-10.jpg',
    url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80', // Heavy flatbed recovery truck towing car
    desc: 'نقل وترحيل السيارات المهملة داخل أحياء مدينة الرياض'
  },
  {
    filename: 'project-11.jpg',
    url: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=1200&q=80', // Municipal environmental health and sanitation service
    desc: 'مكافحة الحيوانات الضالة بمدينة الملك سعود السكنية بديراب'
  },
  {
    filename: 'project-12.jpg',
    url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80', // Heavy machinery maintenance workshop & mechanic
    desc: 'صيانة معدات بلدية محافظة رماح'
  },
  {
    filename: 'project-13.jpg',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1200&q=80', // Road paving and asphalt works in governorate road
    desc: 'صيانة الطرق الرئيسية والسوالف بمحافظة الغاط'
  },
  {
    filename: 'project-14.jpg',
    url: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=1200&q=80', // Traffic safety, concrete road barriers and markings
    desc: 'صيانة وتأهيل الشوارع وأعمال السلامة المرورية بمحافظة الغاط'
  },
  {
    filename: 'project-15.jpg',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80', // Reinforced concrete culverts for stormwater drainage
    desc: 'صيانة شبكة السيول بمحافظة الغاط'
  },
  {
    filename: 'project-16.jpg',
    url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80', // Stormwater culvert and drainage maintenance
    desc: 'صيانة شبكات وعبارات تصريف مياه الأمطار بالخرج'
  },
  {
    filename: 'project-17.jpg',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80', // Asphalt pothole patching & vibratory roller
    desc: 'تأمين وتوريد وتنفيذ ترقيعات سطحية وإغلاق وصيانة الحفر'
  },
  {
    filename: 'project-18.jpg',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=1200&q=80', // Street asphalt patching team
    desc: 'تأمين وتوريد وتنفيذ ترقيعات سطحية بمحافظة الخرج'
  },
  {
    filename: 'project-19.jpg',
    url: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=80', // Massive underground stormwater drainage tunnel
    desc: 'صيانة وتشغيل شبكات تصريف السيول نطاق الغرب'
  },
  {
    filename: 'project-20.jpg',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80', // High pressure jetting & catch basin cleaning
    desc: 'صيانة ونظافة شبكات تصريف الأمطار بالخرج'
  },
  {
    filename: 'project-21.jpg',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80', // Sidewalk interlocking paving stones & curbstones
    desc: 'صيانة أرصفة طريق الملك عبد العزيز بالمزاحمية'
  },
  {
    filename: 'project-22.jpg',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80', // Municipal warehouse, garage, and vehicle maintenance shed
    desc: 'صيانة جدار وحاجز المستودعات وكراج البلدية بالزلفي'
  },
  {
    filename: 'project-23.jpg',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80', // Heavy dump truck hauling construction debris to landfill
    desc: 'تجميع وترحيل المخلفات إلى المردم العام بالخرج'
  },
  {
    filename: 'project-24.jpg',
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80', // Municipal hospitality rest house building
    desc: 'صيانة وترميم مبنى استراحة المجمعة'
  },
  {
    filename: 'project-25.jpg',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', // Modern steel car shade canopies and tile paving
    desc: 'مظلات والبلاط والأسقف والقبو ببلدية الزلفي'
  }
];

const targetDir = path.resolve(process.cwd(), 'public/images/projects');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log(`Starting download of ${projectImages.length} project images...`);

async function downloadImage(img) {
  const dest = path.join(targetDir, img.filename);
  return new Promise((resolve, reject) => {
    https.get(img.url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          const fileStream = fs.createWriteStream(dest);
          redirectRes.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`✓ Downloaded ${img.filename} (${img.desc})`);
            resolve();
          });
        }).on('error', reject);
      } else {
        const fileStream = fs.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✓ Downloaded ${img.filename} (${img.desc})`);
          resolve();
        });
      }
    }).on('error', reject);
  });
}

for (const img of projectImages) {
  try {
    await downloadImage(img);
  } catch (err) {
    console.error(`✗ Error downloading ${img.filename}:`, err.message);
  }
}

console.log('All downloads completed!');

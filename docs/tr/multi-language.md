# Çok Dilli Kılavuz

OpenSpec'i İngilizce dışındaki dillerde üreteçler oluşturacak şekilde yapılandırın.

## Hızlı Kurulum

`openspec/config.yaml` dosyanıza bir dil talimatı ekleyin:

```yaml
schema: spec-driven

context: |
  Dil: Portekizce (pt-BR)
  Tüm üreteçler Brezilya Portekizcesi ile yazılmalıdır.

  # Diğer proje bağlamınızı aşağıya ekleyin...
  Teknoloji yığını: TypeScript, React, Node.js
```

Hepsi bu kadar. Artık tüm üretilen üreteçler Portekizce olacaktır.

## Dil Örnekleri

### Portekizce (Brezilya)

```yaml
context: |
  Dil: Portekizce (pt-BR)
  Tüm üreteçler Brezilya Portekizcesi ile yazılmalıdır.
```

### İspanyolca

```yaml
context: |
  Idioma: Español
  Todos los artefactos deben escribirse en español.
```

### Çince (Basitleştirilmiş)

```yaml
context: |
  语言：中文（简体）
  所有产出物必须用简体中文撰写。
```

### Japonca

```yaml
context: |
  言語：日本語
  すべての成果物は日本語で作成してください。
```

### Fransızca

```yaml
context: |
  Langue : Français
  Tous les artefacts doivent être rédigés en français.
```

### Almanca

```yaml
context: |
  Sprache: Deutsch
  Alle Artefakte müssen auf Deutsch verfasst werden.
```

## İpuçları

### Teknik Terimlerle Başa Çıkma

Teknik terminolojiyi nasıl ele alacağınıza karar verin:

```yaml
context: |
  Dil: Japonca
  Japonca yazın, ancak:
  - "API", "REST", "GraphQL" gibi teknik terimleri İngilizce tutun
  - Kod örnekleri ve dosya yolları İngilizce kalır
```

### Diğer Bağlamla Birleştirme

Dil ayarları, diğer proje bağlamınızla birlikte çalışır:

```yaml
schema: spec-driven

context: |
  Dil: Portekizce (pt-BR)
  Tüm üreteçler Brezilya Portekizcesi ile yazılmalıdır.

  Teknoloji yığını: TypeScript, React 18, Node.js 20
  Veritabanı: PostgreSQL ve Prisma ORM
```

## Doğrulama

Dil yapılandırmanızın çalıştığını doğrulamak için:

```bash
# Talimatları kontrol edin - dil bağlamınızı göstermelidir
openspec instructions proposal --change my-change

# Çıktı dil bağlamınızı içerecektir
```

## İlgili Belgeler

- [Özelleştirme Kılavuzu](./customization.md) - Proje yapılandırma seçenekleri
- [İş Akışları Kılavuzu](./workflows.md) - Tam iş akışı belgeleri
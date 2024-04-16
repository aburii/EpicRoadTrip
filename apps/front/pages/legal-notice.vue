<script setup lang="ts">
definePageMeta({
  layout: 'landing',
});

const { locale, t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <section class="space-y-10">
    <UButton
      variant="link"
      icon="i-heroicons-arrow-left-20-solid"
      color="black"
      :label="t('back')"
      :to="localePath('/')"
    />
    <template v-if="locale === 'fr'">
      <h1 class="text-4xl font-bold">Mentions légales</h1>

      <h2 class="text-2xl font-semibold">Éditeur de l'application :</h2>
      <p>
        Epitech<br />
        123 Rue de l'Innovation<br />
        75000 Paris<br />
        France<br /><br />
        E-mail :
        <NuxtLink href="mailto:jolan.brizard@epitech.eu">jolan.brizard@epitech.eu</NuxtLink></p
      >

      <h2 class="text-2xl font-semibold">Hébergeur de l'application :</h2>
      <p> Railway<br /> </p>

      <h2 class="text-2xl font-semibold">Conditions d'utilisation :</h2>
      <p>
        L'utilisation de l'application Lana est soumise aux conditions générales d'utilisation (CGU)
        disponibles sur l'application.
      </p>

      <h2 class="text-2xl font-semibold">Politique de confidentialité :</h2>
      <p>
        L'application Lana respecte la vie privée de ses utilisateurs. Pour plus d'informations sur
        la collecte et le traitement des données personnelles, veuillez consulter notre politique de
        confidentialité disponible sur l'application.
      </p>

      <h2>Propriété intellectuelle :</h2>
      <p>
        L'ensemble du contenu de l'application Lana, y compris les textes, les images, les vidéos et
        les logos, est protégé par les lois sur la propriété intellectuelle et est la propriété
        exclusive d'Epitech. Toute reproduction ou utilisation non autorisée est strictement
        interdite.
      </p>

      <h2 class="text-2xl font-semibold">Responsabilité :</h2>
      <p>
        Epitech décline toute responsabilité en cas de dommages causés par l'utilisation de
        l'application Lana. Les informations fournies dans l'application sont données à titre
        indicatif et peuvent être sujettes à des changements sans préavis.
      </p>

      <h2 class="text-2xl font-semibold">Réclamation :</h2>
      <p>
        Pour toute réclamation ou question concernant l'application Lana, veuillez nous contacter à
        l'adresse e-mail indiquée ci-dessus.
      </p>

      <h2 class="text-2xl font-semibold">Loi applicable et juridiction compétente :</h2>
      <p>
        Les présentes mentions légales sont régies par le droit français. En cas de litige, les
        tribunaux de Paris seront seuls compétents.
      </p>
    </template>
    <template v-else>
      <h1 class="text-4xl font-bold">Legal Notice</h1>

      <h2 class="text-2xl font-semibold">Application Publisher:</h2>
      <p
        >Epitech<br />
        123 Innovation Street<br />
        75000 Paris<br />
        France<br /><br />
        E-mail :
        <NuxtLink href="mailto:jolan.brizard@epitech.eu">jolan.brizard@epitech.eu</NuxtLink></p
      >

      <h2 class="text-2xl font-semibold">Application Host:</h2>
      <p>Railway<br /> </p>

      <h2 class="text-2xl font-semibold">Terms of Use:</h2>
      <p
        >Use of the Lana application is subject to the general terms and conditions (GTC) available
        on the application.</p
      >

      <h2 class="text-2xl font-semibold">Privacy Policy:</h2>
      <p
        >The Lana application respects the privacy of its users. For more information on the
        collection and processing of personal data, please consult our privacy policy available on
        the application.</p
      >

      <h2 class="text-2xl font-semibold">Intellectual Property:</h2>
      <p
        >All content of the Lana application, including text, images, videos, and logos, is
        protected by intellectual property laws and is the exclusive property of Epitech. Any
        unauthorized reproduction or use is strictly prohibited.</p
      >

      <h2 class="text-2xl font-semibold">Liability:</h2>
      <p
        >Epitech declines all responsibility for damages caused by the use of the Lana application.
        The information provided in the application is for informational purposes only and may be
        subject to change without notice.</p
      >

      <h2 class="text-2xl font-semibold">Complaints:</h2>
      <p
        >For any complaints or questions regarding the Lana application, please contact us at the
        email address provided above.</p
      >

      <h2>Applicable Law and Jurisdiction:</h2>
      <p
        >These legal notices are governed by French law. In case of dispute, the courts of Paris
        shall have sole jurisdiction.</p
      >
    </template>
  </section>
</template>

<style scoped></style>

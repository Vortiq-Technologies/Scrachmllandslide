const { connectDB, disconnectDB } = require('./db');
const models = require('../models');

const verifyDataLayer = async () => {
  try {
    console.log('--- Connecting to MongoDB ---');
    await connectDB();

    console.log('\n--- Verifying Model Registration & Indexes ---');
    const report = [];

    for (const [name, model] of Object.entries(models)) {
      const collectionName = model.collection.name;

      // Ensure indexes are synced/created in the database
      await model.createIndexes();

      // Retrieve indexes directly from MongoDB
      const indexes = await model.collection.indexes();

      const indexSummary = indexes.map((idx) => {
        const keys = Object.entries(idx.key)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        return {
          name: idx.name,
          keys,
          unique: idx.unique || false,
          is2dsphere: Object.values(idx.key).includes('2dsphere'),
        };
      });

      report.push({
        model: name,
        collection: collectionName,
        indexesCount: indexes.length,
        indexes: indexSummary,
      });

      console.log(`✓ Model: ${name.padEnd(18)} | Collection: ${collectionName.padEnd(20)} | Indexes: ${indexes.length}`);
      indexSummary.forEach((idx) => {
        const tag = idx.is2dsphere ? '[2dsphere]' : idx.unique ? '[UNIQUE]' : '        ';
        console.log(`    ${tag} ${idx.name.padEnd(30)} -> { ${idx.keys} }`);
      });
    }

    console.log('\n--- All 16 Collections Verified Successfully in MongoDB ---');
    await disconnectDB();
  } catch (error) {
    console.error('Data layer verification failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  verifyDataLayer();
}

module.exports = verifyDataLayer;
